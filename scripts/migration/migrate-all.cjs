const fs = require('node:fs');
const path = require('node:path');

const { buildContentRecord } = require('./content-record.cjs');
const { createContentRules } = require('./content-rules.cjs');
const { extractManualAppendix, MANUAL_APPENDIX_HEADING } = require('./migration-doc.cjs');
const { PAGES_MANIFEST_PATH, cleanupManagedSource } = require('./source-cleanup.cjs');
const { renderFrontMatterDocument } = require('./render-front-matter.cjs');
const { handleExplicitResources } = require('./resource-handler.cjs');
const { scanContentCandidates } = require('./content-scan.cjs');

const REPO_ROOT = path.resolve(__dirname, '..', '..');
const REPORT_PATH = 'docs/migration/hexo-full-migration-report.md';
const GIT_META_PATH = '.migration/git-meta.json';

function walkDirectory(directoryPath) {
  const entries = fs.readdirSync(directoryPath, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const entryPath = path.join(directoryPath, entry.name);

    if (entry.isDirectory()) {
      files.push(...walkDirectory(entryPath));
      continue;
    }

    if (entry.isFile()) {
      files.push(entryPath);
    }
  }

  return files;
}

function normalizeSourcePath(sourcePath) {
  return sourcePath.replaceAll('\\', '/');
}

function stripContentPrefix(sourcePath) {
  const normalized = normalizeSourcePath(sourcePath);
  return normalized.startsWith('content/') ? normalized.slice('content/'.length) : normalized;
}

function summarizeCounts(records, excludedCount) {
  return {
    scanned: records.length,
    excluded: excludedCount,
    success: records.filter((record) => record.resultKind === 'success').length,
    degraded: records.filter((record) => record.resultKind === 'degraded').length,
    manualReviewUnwritten: records.filter((record) => record.resultKind === 'manual_review_unwritten').length
  };
}

function buildBaseIssues(record) {
  if (record.resultKind === 'degraded' && record.reason) {
    return [
      {
        level: 'degraded',
        reason: record.reason
      }
    ];
  }

  return [];
}

function mergeRecordWithResources(record, resourceResult) {
  const issues = [...buildBaseIssues(record), ...(resourceResult.issues || [])];
  const resultKind = record.resultKind === 'degraded' || resourceResult.resultKind === 'degraded'
    ? 'degraded'
    : 'success';

  return {
    ...record,
    frontMatter: resourceResult.frontMatter,
    body: resourceResult.markdown,
    issues,
    resultKind,
    reason: record.reason || resourceResult.reason || null
  };
}

function getRecordScope(record) {
  return record.kind === 'post' ? record.category : record.slug;
}

function getManualStatus(record) {
  return record.reason === 'missing_title' ? '未写入' : '需人工确认后重试';
}

function getManualAction(record) {
  switch (record.reason) {
    case 'missing_title':
      return '补充标题后重新执行迁移';
    case 'target_path_conflict':
      return '处理目标路径冲突后重新执行迁移';
    case 'nested_page_path':
      return '调整页面层级后重新执行迁移';
    default:
      return '人工确认问题后重新执行迁移';
  }
}

function getDegradedAction(record) {
  switch (record.reason) {
    case 'missing_git_dates':
      return '补齐 Git 时间后复核';
    case 'missing_resource':
      return '补齐缺失资源后复核';
    case 'resource_target_conflict':
      return '处理资源冲突后复核';
    default:
      return '补齐异常项后复核';
  }
}

function renderTable(headers, rows) {
  const lines = [
    `| ${headers.join(' | ')} |`,
    `| ${headers.map(() => '---').join(' | ')} |`
  ];

  if (rows.length === 0) {
    lines.push(`| ${headers.map((_, index) => (index === 0 ? '无' : '-')).join(' | ')} |`);
    return lines.join('\n');
  }

  for (const row of rows) {
    lines.push(`| ${row.join(' | ')} |`);
  }

  return lines.join('\n');
}

function readGitMetaFile(rootDir) {
  const filePath = path.join(rootDir, GIT_META_PATH);

  if (!fs.existsSync(filePath)) {
    return {};
  }

  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function countExcludedCandidates({ rootDir, contentRules }) {
  const contentDir = path.join(rootDir, 'content');

  if (!fs.existsSync(contentDir)) {
    return 0;
  }

  return walkDirectory(contentDir)
    .map((filePath) => path.relative(rootDir, filePath).replaceAll(path.sep, '/'))
    .filter((relativePath) => relativePath.endsWith('.md'))
    .filter((relativePath) => !contentRules.classify(relativePath).include)
    .length;
}

function readSourceMarkdown(rootDir, sourcePath) {
  return fs.readFileSync(path.join(rootDir, sourcePath), 'utf8');
}

function writeMigratedDocument(rootDir, targetPath, document) {
  const filePath = path.join(rootDir, targetPath);
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, document, 'utf8');
}

function writePagesManifest(rootDir, pagePaths) {
  const filePath = path.join(rootDir, PAGES_MANIFEST_PATH);
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify({ paths: pagePaths }, null, 2)}\n`, 'utf8');
}

function readExistingManualAppendix(rootDir, reportPath = REPORT_PATH) {
  const filePath = path.join(rootDir, reportPath);

  if (!fs.existsSync(filePath)) {
    return `${MANUAL_APPENDIX_HEADING}\n`;
  }

  const appendix = extractManualAppendix(fs.readFileSync(filePath, 'utf8'));
  return appendix || `${MANUAL_APPENDIX_HEADING}\n`;
}

function writeReport(rootDir, reportPath, report) {
  const filePath = path.join(rootDir, reportPath);
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, report, 'utf8');
}

function renderMigrationReport({ summary, records, counts, manualAppendix }) {
  const successRows = records
    .filter((record) => record.resultKind === 'success')
    .map((record) => [
      `\`${record.sourcePath}\``,
      `\`${record.targetPath}\``,
      `\`${record.kind}\``,
      `\`${getRecordScope(record)}\``,
      `\`${record.resultKind}\``,
      `\`${record.reason || '-'}\``
    ]);
  const degradedRows = records
    .filter((record) => record.resultKind === 'degraded')
    .map((record) => [
      `\`${record.sourcePath}\``,
      `\`${record.targetPath}\``,
      `\`${record.reason}\``,
      `\`${(record.issues || []).map((issue) => issue.reason).filter(Boolean).join(', ') || record.reason}\``,
      `\`${getDegradedAction(record)}\``,
      '`已写入待复核`'
    ]);
  const manualRows = records
    .filter((record) => record.resultKind === 'manual_review_unwritten')
    .map((record) => [
      `\`${record.sourcePath}\``,
      `\`${record.targetPath || getRecordScope(record)}\``,
      `\`${record.reason}\``,
      `\`${getManualAction(record)}\``,
      `\`${getManualStatus(record)}\``
    ]);
  const lines = [
    '# Hexo Full Migration Report',
    '',
    '## 迁移摘要',
    '',
    `- 生成时间: ${summary.generatedAt}`,
    '- 迁移根目录: `./`',
    '',
    '## 成功迁移',
    '',
    renderTable(['来源路径', '目标路径', '内容类型', '分类或页面 slug', '结果分类', '备注'], successRows),
    '',
    '## 降级迁移',
    '',
    renderTable(['来源路径', '实际目标路径', '降级原因', '缺失字段或异常类型', '建议后续动作', '当前状态'], degradedRows),
    '',
    '## 人工复核未写入',
    '',
    renderTable(['来源路径', '预期目标路径或目标类别', '问题原因', '建议处理方式', '当前状态'], manualRows),
    '',
    '## 统计信息',
    '',
    `- 扫描文件总数: ${counts.scanned}`,
    `- 排除文件总数: ${counts.excluded}`,
    `- 成功迁移数量: ${counts.success}`,
    `- 降级迁移数量: ${counts.degraded}`,
    `- 人工复核未写入数量: ${counts.manualReviewUnwritten}`,
    ''
  ];

  if (manualAppendix) {
    lines.push(manualAppendix.trimEnd());
  } else {
    lines.push(MANUAL_APPENDIX_HEADING);
  }

  return `${lines.join('\n')}\n`;
}

function migrateAll(options = {}) {
  const rootDir = options.rootDir ?? REPO_ROOT;
  const now = options.now ?? (() => new Date().toISOString());
  const createRules = options.createContentRules ?? ((params) => createContentRules(params));
  const scanCandidates = options.scanContentCandidates ?? ((params) => scanContentCandidates(params));
  const countExcluded = options.countExcludedCandidates ?? ((params) => countExcludedCandidates(params));
  const readGitMeta = options.readGitMetaFile ?? ((value) => readGitMetaFile(value));
  const cleanupSource = options.cleanupManagedSource ?? ((params) => cleanupManagedSource(params));
  const readMarkdown = options.readSourceMarkdown ?? ((repoRoot, sourcePath) => readSourceMarkdown(repoRoot, sourcePath));
  const buildRecord = options.buildContentRecord ?? ((params) => buildContentRecord(params));
  const handleResources = options.handleExplicitResources ?? ((params) => handleExplicitResources(params));
  const writeDocument = options.writeMigratedDocument ?? ((repoRoot, targetPath, document) => writeMigratedDocument(repoRoot, targetPath, document));
  const writeManifest = options.writePagesManifest ?? ((repoRoot, pagePaths) => writePagesManifest(repoRoot, pagePaths));
  const readAppendix = options.readExistingManualAppendix ?? ((repoRoot, reportPath) => readExistingManualAppendix(repoRoot, reportPath));
  const writeReportFile = options.writeReport ?? ((repoRoot, reportPath, report) => writeReport(repoRoot, reportPath, report));
  const contentRules = createRules({ rootDir });
  const candidates = scanCandidates({ rootDir, contentRules });
  const excluded = countExcluded({ rootDir, contentRules });
  const gitMetaByPath = readGitMeta(rootDir);

  cleanupSource({ rootDir });

  const existingTargetPaths = new Set();
  const pagePaths = new Set();
  const records = [];

  for (const candidate of candidates) {
    const markdown = readMarkdown(rootDir, candidate.sourcePath);
    const record = buildRecord({
      sourcePath: candidate.sourcePath,
      markdown,
      gitMeta: gitMetaByPath[stripContentPrefix(candidate.sourcePath)] ?? gitMetaByPath[candidate.sourcePath] ?? null,
      existingTargetPaths,
      contentRules
    });

    if (record.targetPath) {
      existingTargetPaths.add(record.targetPath);
    }

    if (record.resultKind === 'manual_review_unwritten') {
      records.push({ ...record, issues: [] });
      continue;
    }

    const resourceResult = handleResources({
      rootDir,
      sourcePath: record.sourcePath,
      targetPath: record.targetPath,
      kind: record.kind,
      markdown: record.body,
      frontMatter: record.frontMatter
    });
    const finalRecord = mergeRecordWithResources(record, resourceResult);
    const document = renderFrontMatterDocument({
      frontMatter: finalRecord.frontMatter,
      body: finalRecord.body
    });

    writeDocument(rootDir, finalRecord.targetPath, document);

    if (finalRecord.kind === 'page') {
      pagePaths.add(path.posix.dirname(finalRecord.targetPath));
    }

    records.push(finalRecord);
  }

  const counts = summarizeCounts(records, excluded);
  const manualAppendix = readAppendix(rootDir, REPORT_PATH);
  const report = renderMigrationReport({
    summary: {
      generatedAt: now(),
      rootDir: './'
    },
    records,
    counts,
    manualAppendix
  });
  const sortedPagePaths = [...pagePaths].sort((left, right) => left.localeCompare(right));

  writeManifest(rootDir, sortedPagePaths);
  writeReportFile(rootDir, REPORT_PATH, report);

  return {
    records,
    counts,
    reportPath: REPORT_PATH,
    pagesManifestPath: PAGES_MANIFEST_PATH
  };
}

if (require.main === module) {
  const result = migrateAll();
  process.stdout.write(
    `Migrated ${result.counts.scanned} files and wrote ${result.reportPath}\n`
  );
}

module.exports = {
  GIT_META_PATH,
  MANUAL_APPENDIX_HEADING,
  PAGES_MANIFEST_PATH,
  REPORT_PATH,
  countExcludedCandidates,
  migrateAll,
  readExistingManualAppendix,
  readGitMetaFile,
  renderMigrationReport,
  writePagesManifest
};
