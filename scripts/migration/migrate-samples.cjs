const fs = require('node:fs');
const path = require('node:path');
const { execSync } = require('node:child_process');

const { classifyContent } = require('./classify-content.cjs');
const { extractTitle } = require('./extract-title.cjs');
const { buildGitDateCommand, normalizeGitDates } = require('./git-dates.cjs');
const { mapTargetPath } = require('./path-mapper.cjs');
const { renderFrontMatterDocument } = require('./render-front-matter.cjs');
const { SAMPLE_PATHS } = require('./sample-set.cjs');

const REPO_ROOT = path.resolve(__dirname, '..', '..');
const MAPPING_DOC_PATH = 'docs/migration/hexo-sample-mapping.md';
const MANUAL_APPENDIX_HEADING = '## 手工附录';

function buildSampleRecord({ sourcePath, markdown, gitDateLines }) {
  const normalizedSourcePath = sourcePath.replaceAll('\\', '/');
  const classification = classifyContent(normalizedSourcePath);
  const title = extractTitle(markdown);
  const dates = normalizeGitDates({ lines: gitDateLines });
  const fileName = path.posix.basename(normalizedSourcePath);
  const targetPath = mapTargetPath(normalizedSourcePath, {
    ...classification,
    fileName
  });
  const frontMatter = {
    title,
    date: dates.date,
    updated: dates.updated
  };

  if (classification.kind === 'post') {
    frontMatter.categories = [normalizedSourcePath.split('/')[0]];
  }

  return {
    sourcePath: normalizedSourcePath,
    kind: classification.kind,
    targetPath,
    frontMatter,
    body: markdown
  };
}

function buildSampleRecordWithOptionalMetadata({ sourcePath, markdown, title, dates }) {
  const normalizedSourcePath = sourcePath.replaceAll('\\', '/');
  const classification = classifyContent(normalizedSourcePath);
  const fileName = path.posix.basename(normalizedSourcePath);
  const targetPath = mapTargetPath(normalizedSourcePath, {
    ...classification,
    fileName
  });
  const frontMatter = {};

  if (title) {
    frontMatter.title = title;
  }

  if (dates) {
    frontMatter.date = dates.date;
    frontMatter.updated = dates.updated;
  }

  if (classification.kind === 'post') {
    frontMatter.categories = [normalizedSourcePath.split('/')[0]];
  }

  return {
    sourcePath: normalizedSourcePath,
    kind: classification.kind,
    targetPath,
    frontMatter,
    body: markdown
  };
}

function extractManualAppendix(existingDocument) {
  if (!existingDocument) {
    return '';
  }

  const startIndex = existingDocument.indexOf(MANUAL_APPENDIX_HEADING);

  if (startIndex === -1) {
    return '';
  }

  return existingDocument.slice(startIndex).trimEnd();
}

function renderSampleMappingDocument({ records, manualReviewItems, manualAppendix = '' }) {
  const lines = [
    '# Hexo Sample Mapping',
    '',
    '| 来源路径 | 目标路径 | 内容类型 | categories |',
    '| --- | --- | --- | --- |'
  ];

  for (const record of records) {
    const categories = Array.isArray(record.frontMatter.categories)
      ? record.frontMatter.categories.join(', ')
      : '-';

    lines.push(
      `| \`${record.sourcePath}\` | \`${record.targetPath}\` | \`${record.kind}\` | \`${categories}\` |`
    );
  }

  lines.push('', '## 人工复核项');

  if (manualReviewItems.length === 0) {
    lines.push('', '- 无');
  } else {
    lines.push('');

    for (const item of manualReviewItems) {
      lines.push(`- ${item}`);
    }
  }

  if (manualAppendix) {
    lines.push('', manualAppendix);
  }

  return `${lines.join('\n')}\n`;
}

function readExistingManualAppendix(repoRoot, relativePath) {
  const absolutePath = path.join(repoRoot, relativePath);

  if (!fs.existsSync(absolutePath)) {
    return '';
  }

  const existingDocument = fs.readFileSync(absolutePath, 'utf8');
  return extractManualAppendix(existingDocument);
}

function readGitDateLinesFromRepo(repoRoot, sourcePath) {
  const command = buildGitDateCommand(sourcePath);
  const output = execSync(command, {
    cwd: repoRoot,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe']
  });

  return output
    .split(/\r?\n/u)
    .map((line) => line.trim())
    .filter(Boolean);
}

function writeTextFile(repoRoot, relativePath, content) {
  const absolutePath = path.join(repoRoot, relativePath);

  fs.mkdirSync(path.dirname(absolutePath), { recursive: true });
  fs.writeFileSync(absolutePath, content, 'utf8');
}

function migrateSamples(options = {}) {
  const repoRoot = options.repoRoot ?? REPO_ROOT;
  const samplePaths = options.samplePaths ?? SAMPLE_PATHS;
  const readGitDateLines = options.readGitDateLines ?? ((sourcePath) => readGitDateLinesFromRepo(repoRoot, sourcePath));
  const records = [];
  const manualReviewItems = [];

  for (const sourcePath of samplePaths) {
    const absoluteSourcePath = path.join(repoRoot, sourcePath);
    const markdown = fs.readFileSync(absoluteSourcePath, 'utf8');
    let gitDateLines = [];
    let title;
    let dates;

    try {
      title = extractTitle(markdown);
    } catch {
      manualReviewItems.push(`${sourcePath}: missing title`);
    }

    try {
      gitDateLines = readGitDateLines(sourcePath);

      if (gitDateLines.length === 0) {
        manualReviewItems.push(`${sourcePath}: missing git author dates`);
      } else {
        dates = normalizeGitDates({ lines: gitDateLines });
      }
    } catch {
      manualReviewItems.push(`${sourcePath}: missing git author dates`);
    }

    let record;

    if (title && dates) {
      record = buildSampleRecord({ sourcePath, markdown, gitDateLines });
    } else {
      record = buildSampleRecordWithOptionalMetadata({
        sourcePath,
        markdown,
        title,
        dates
      });
    }

    const document = renderFrontMatterDocument({
      frontMatter: record.frontMatter,
      body: record.body
    });

    writeTextFile(repoRoot, record.targetPath, document);
    records.push(record);
  }

  const mappingDocument = renderSampleMappingDocument({
    records,
    manualReviewItems,
    manualAppendix: readExistingManualAppendix(repoRoot, MAPPING_DOC_PATH)
  });

  writeTextFile(repoRoot, MAPPING_DOC_PATH, mappingDocument);

  return {
    records,
    manualReviewItems,
    mappingDocumentPath: MAPPING_DOC_PATH
  };
}

if (require.main === module) {
  const result = migrateSamples();
  process.stdout.write(
    `Migrated ${result.records.length} samples and wrote ${result.mappingDocumentPath}\n`
  );
}

module.exports = {
  buildSampleRecord,
  extractManualAppendix,
  migrateSamples,
  renderSampleMappingDocument
};
