const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

function loadSubject() {
  delete require.cache[require.resolve('../../scripts/migration/migrate-all.cjs')];
  return require('../../scripts/migration/migrate-all.cjs');
}

function makeFixture() {
  const rootDir = fs.mkdtempSync(path.join(os.tmpdir(), 'migrate-all-'));

  return {
    rootDir,
    write(relativePath, content = '') {
      const filePath = path.join(rootDir, relativePath);
      fs.mkdirSync(path.dirname(filePath), { recursive: true });
      fs.writeFileSync(filePath, content, 'utf8');
      return filePath;
    },
    read(relativePath) {
      return fs.readFileSync(path.join(rootDir, relativePath), 'utf8');
    },
    exists(relativePath) {
      return fs.existsSync(path.join(rootDir, relativePath));
    }
  };
}

function seedMigrationFixture(fixture) {
  fixture.write('content/Note/success.md', '# Success\n\n![Diagram](./assets/diagram.png)\n');
  fixture.write('content/Note/assets/diagram.png', 'diagram');
  fixture.write('content/Note/no-git.md', '# No Git\n\n正文\n');
  fixture.write('content/Agent/README.md', '# Agent Readme\n\n正文\n');
  fixture.write('content/Other/README.md', '# Other Readme\n\n正文\n');
  fixture.write('content/Pages/about.md', '# About\n\n正文\n');
  fixture.write('content/Pages/untitled.md', '只有正文\n');
  fixture.write('content/Pages/README.md', '# Excluded\n');
  fixture.write('content/Agent/slides.marp.md', '# Excluded\n');
  fixture.write('.migration/include-readmes.json', JSON.stringify({
    paths: [
      'content/Agent/README.md',
      'content/Other/README.md'
    ]
  }, null, 2));
  fixture.write('.migration/git-meta.json', JSON.stringify({
    'Note/success.md': {
      date: '2024-01-01T00:00:00+08:00',
      updated: '2024-01-03T00:00:00+08:00'
    },
    'Agent/README.md': {
      date: '2024-02-01T00:00:00+08:00',
      updated: '2024-02-02T00:00:00+08:00'
    },
    'Other/README.md': {
      date: '2024-03-01T00:00:00+08:00',
      updated: '2024-03-02T00:00:00+08:00'
    },
    'Pages/about.md': {
      date: '2024-04-01T00:00:00+08:00',
      updated: '2024-04-02T00:00:00+08:00'
    }
  }, null, 2));
  fixture.write('.migration/pages-manifest.json', JSON.stringify({
    paths: ['source/legacy-page']
  }, null, 2));
  fixture.write('source/_posts/stale.md', '# stale\n');
  fixture.write('source/legacy-page/index.md', '# stale page\n');
  fixture.write('source/manual/index.md', '# keep\n');
}

test('renderMigrationReport includes required sections and preserves manual appendix', () => {
  const { renderMigrationReport } = loadSubject();

  const report = renderMigrationReport({
    summary: {
      generatedAt: '2026-03-21T10:00:00.000Z',
      rootDir: '/tmp/demo'
    },
    records: [
      {
        sourcePath: 'content/Note/success.md',
        targetPath: 'source/_posts/success.md',
        kind: 'post',
        category: 'Note',
        resultKind: 'success',
        reason: null,
        status: '已写入'
      },
      {
        sourcePath: 'content/Note/no-git.md',
        targetPath: 'source/_posts/no-git.md',
        kind: 'post',
        category: 'Note',
        resultKind: 'degraded',
        reason: 'missing_git_dates',
        issues: [
          {
            reason: 'missing_git_dates'
          }
        ],
        status: '已写入待复核'
      },
      {
        sourcePath: 'content/Pages/untitled.md',
        targetPath: 'source/untitled/index.md',
        kind: 'page',
        slug: 'untitled',
        resultKind: 'manual_review_unwritten',
        reason: 'missing_title',
        status: '未写入'
      }
    ],
    counts: {
      scanned: 3,
      excluded: 2,
      success: 1,
      degraded: 1,
      manualReviewUnwritten: 1
    },
    manualAppendix: '## 手工附录\n\n- 这段说明需要保留'
  });

  assert.match(report, /^# Hexo Full Migration Report/m);
  assert.match(report, /^## 迁移摘要$/m);
  assert.match(report, /- 迁移根目录: `\.\/`/);
  assert.match(report, /^## 成功迁移$/m);
  assert.match(report, /^## 降级迁移$/m);
  assert.match(report, /^## 人工复核未写入$/m);
  assert.match(report, /^## 统计信息$/m);
  assert.match(report, /\| 来源路径 \| 目标路径 \| 内容类型 \| 分类或页面 slug \| 结果分类 \| 备注 \|/);
  assert.match(report, /\| `content\/Note\/success\.md` \| `source\/_posts\/success\.md` \| `post` \| `Note` \| `success` \| `-` \|/);
  assert.match(report, /\| `content\/Note\/no-git\.md` \| `source\/_posts\/no-git\.md` \| `missing_git_dates` \| `missing_git_dates` \| `补齐 Git 时间后复核` \| `已写入待复核` \|/);
  assert.match(report, /\| `content\/Pages\/untitled\.md` \| `source\/untitled\/index\.md` \| `missing_title` \| `补充标题后重新执行迁移` \| `未写入` \|/);
  assert.match(report, /- 扫描文件总数: 3/);
  assert.match(report, /- 排除文件总数: 2/);
  assert.match(report, /- 成功迁移数量: 1/);
  assert.match(report, /- 降级迁移数量: 1/);
  assert.match(report, /- 人工复核未写入数量: 1/);
  assert.match(report, /^## 手工附录$/m);
  assert.match(report, /这段说明需要保留/);
  assert.doesNotMatch(report, /\/tmp\/demo/);
});

test('migrateAll writes report and pages manifest and preserves manual appendix on rerun', () => {
  const { migrateAll, REPORT_PATH, PAGES_MANIFEST_PATH } = loadSubject();
  const fixture = makeFixture();

  seedMigrationFixture(fixture);

  const firstResult = migrateAll({ rootDir: fixture.rootDir });

  assert.equal(firstResult.counts.scanned, 6);
  assert.equal(firstResult.counts.excluded, 2);
  assert.equal(firstResult.counts.success, 3);
  assert.equal(firstResult.counts.degraded, 1);
  assert.equal(firstResult.counts.manualReviewUnwritten, 2);
  assert.equal(fixture.exists('source/_posts/stale.md'), false);
  assert.equal(fixture.exists('source/legacy-page/index.md'), false);
  assert.equal(fixture.exists('source/manual/index.md'), true);
  assert.equal(fixture.exists('source/_posts/success.md'), true);
  assert.equal(fixture.exists('source/_posts/success/assets/diagram.png'), true);
  assert.equal(fixture.exists('source/about/index.md'), true);
  assert.equal(fixture.exists('source/_posts/no-git.md'), true);
  assert.equal(fixture.exists('source/_posts/README.md'), true);
  assert.equal(fixture.exists('source/untitled/index.md'), false);
  assert.deepEqual(JSON.parse(fixture.read(PAGES_MANIFEST_PATH)), {
    paths: ['source/about']
  });

  const firstReport = fixture.read(REPORT_PATH);
  assert.match(firstReport, /^## 手工附录$/m);
  assert.match(firstReport, /\| `content\/Note\/no-git\.md` \| `source\/_posts\/no-git\.md` \| `missing_git_dates`/);
  assert.match(firstReport, /\| `content\/Other\/README\.md` \| `source\/_posts\/README\.md` \| `target_path_conflict`/);

  fs.writeFileSync(
    path.join(fixture.rootDir, REPORT_PATH),
    `${firstReport.trimEnd()}\n\n- rerun appendix should stay\n`,
    'utf8'
  );

  const secondResult = migrateAll({ rootDir: fixture.rootDir });
  const secondReport = fixture.read(REPORT_PATH);

  assert.equal(secondResult.counts.success, 3);
  assert.match(secondReport, /^## 手工附录$/m);
  assert.match(secondReport, /rerun appendix should stay/);
  assert.equal(secondReport.match(/^## 手工附录$/gm)?.length, 1);
});

test('migrateAll fails immediately when README whitelist input is invalid', () => {
  const { migrateAll } = loadSubject();
  const fixture = makeFixture();

  fixture.write('content/Note/post.md', '# Post\n');
  fixture.write('.migration/include-readmes.json', JSON.stringify({
    paths: ['README.md']
  }, null, 2));
  fixture.write('.migration/git-meta.json', JSON.stringify({}, null, 2));

  assert.throws(() => {
    migrateAll({ rootDir: fixture.rootDir });
  }, /README whitelist paths must stay under content\/<dir>/i);
});

test('migrateAll follows the required pipeline order', () => {
  const { migrateAll } = loadSubject();
  const calls = [];

  migrateAll({
    rootDir: '/tmp/demo',
    now: () => '2026-03-21T10:00:00.000Z',
    createContentRules() {
      calls.push('read-whitelist');
      return {
        classify() {
          return { include: true, kind: 'post' };
        }
      };
    },
    scanContentCandidates() {
      calls.push('scan-content');
      return [
        {
          sourcePath: 'content/Note/demo.md',
          kind: 'post',
          category: 'Note',
          slug: 'demo'
        }
      ];
    },
    countExcludedCandidates() {
      return 0;
    },
    readGitMetaFile() {
      calls.push('read-git-meta');
      return {
        'Note/demo.md': {
          date: '2024-01-01T00:00:00+08:00',
          updated: '2024-01-02T00:00:00+08:00'
        }
      };
    },
    cleanupManagedSource() {
      calls.push('cleanup-managed-source');
      return { removedPaths: [] };
    },
    readSourceMarkdown() {
      return '# Demo\n';
    },
    buildContentRecord() {
      calls.push('build-content-record');
      return {
        sourcePath: 'content/Note/demo.md',
        targetPath: 'source/_posts/demo.md',
        kind: 'post',
        category: 'Note',
        frontMatter: {
          title: 'Demo'
        },
        body: '# Demo\n',
        resultKind: 'success',
        reason: null
      };
    },
    handleExplicitResources() {
      calls.push('handle-resources');
      return {
        markdown: '# Demo\n',
        frontMatter: {
          title: 'Demo'
        },
        issues: [],
        resultKind: 'success',
        reason: null
      };
    },
    writeMigratedDocument() {
      calls.push('write-source');
    },
    writePagesManifest() {
      calls.push('write-pages-manifest');
    },
    readExistingManualAppendix() {
      return '';
    },
    writeReport() {
      calls.push('write-report');
    }
  });

  assert.deepEqual(calls, [
    'read-whitelist',
    'scan-content',
    'read-git-meta',
    'cleanup-managed-source',
    'build-content-record',
    'handle-resources',
    'write-source',
    'write-pages-manifest',
    'write-report'
  ]);
});

test('migrateAll can preserve manual appendix without loading migrate-samples module', () => {
  const modulePath = require.resolve('../../scripts/migration/migrate-samples.cjs');
  const originalEntry = require.cache[modulePath];

  require.cache[modulePath] = {
    id: modulePath,
    filename: modulePath,
    loaded: true,
    exports: {
      get extractManualAppendix() {
        throw new Error('migrate-all should not depend on migrate-samples internals');
      }
    }
  };

  delete require.cache[require.resolve('../../scripts/migration/migrate-all.cjs')];

  assert.doesNotThrow(() => {
    require('../../scripts/migration/migrate-all.cjs');
  });

  delete require.cache[require.resolve('../../scripts/migration/migrate-all.cjs')];

  if (originalEntry) {
    require.cache[modulePath] = originalEntry;
  } else {
    delete require.cache[modulePath];
  }
});
