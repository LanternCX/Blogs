const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const {
  buildSampleRecord,
  migrateSamples,
  renderSampleMappingDocument
} = require('../../scripts/migration/migrate-samples.cjs');

test('buildSampleRecord builds post record for Note content', () => {
  const record = buildSampleRecord({
    sourcePath: 'Note/OOP.md',
    markdown: '## OOP\n\n正文',
    gitDateLines: ['2024-01-03T00:00:00+08:00', '2024-01-01T00:00:00+08:00']
  });

  assert.equal(record.kind, 'post');
  assert.equal(record.targetPath, 'source/_posts/OOP.md');
  assert.equal(record.frontMatter.title, 'OOP');
  assert.equal(record.frontMatter.date, '2024-01-01T00:00:00+08:00');
  assert.equal(record.frontMatter.updated, '2024-01-03T00:00:00+08:00');
  assert.deepEqual(record.frontMatter.categories, ['Note']);
  assert.equal(record.body, '## OOP\n\n正文');
});

test('buildSampleRecord builds page record without categories', () => {
  const record = buildSampleRecord({
    sourcePath: 'Pages/about.md',
    markdown: '## 关于\n\n正文',
    gitDateLines: ['2024-01-02T00:00:00+08:00', '2024-01-01T00:00:00+08:00']
  });

  assert.equal(record.kind, 'page');
  assert.equal(record.targetPath, 'source/about/index.md');
  assert.equal(record.frontMatter.title, '关于');
  assert.equal(record.frontMatter.date, '2024-01-01T00:00:00+08:00');
  assert.equal(record.frontMatter.updated, '2024-01-02T00:00:00+08:00');
  assert.equal('categories' in record.frontMatter, false);
  assert.equal(record.body, '## 关于\n\n正文');
});

test('renderSampleMappingDocument includes mapping rows and manual review list', () => {
  const document = renderSampleMappingDocument({
    records: [
      {
        sourcePath: 'Note/OOP.md',
        targetPath: 'source/_posts/OOP.md',
        kind: 'post',
        frontMatter: {
          title: 'OOP',
          date: '2024-01-01T00:00:00+08:00',
          updated: '2024-01-03T00:00:00+08:00',
          categories: ['Note']
        }
      },
      {
        sourcePath: 'Pages/about.md',
        targetPath: 'source/about/index.md',
        kind: 'page',
        frontMatter: {
          title: '关于',
          date: '2024-01-01T00:00:00+08:00',
          updated: '2024-01-02T00:00:00+08:00'
        }
      }
    ],
    manualReviewItems: ['Pages/about.md: missing git author dates']
  });

  assert.match(document, /\| 来源路径 \| 目标路径 \| 内容类型 \| categories \|/);
  assert.match(document, /\| `Note\/OOP\.md` \| `source\/_posts\/OOP\.md` \| `post` \| `Note` \|/);
  assert.match(document, /\| `Pages\/about\.md` \| `source\/about\/index\.md` \| `page` \| `-` \|/);
  assert.match(document, /- Pages\/about\.md: missing git author dates/);
});

test('migrateSamples records missing title for manual review without aborting', () => {
  const repoRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'migrate-samples-'));
  const sourcePath = 'Note/untitled.md';

  fs.mkdirSync(path.join(repoRoot, 'content/Note'), { recursive: true });
  fs.writeFileSync(path.join(repoRoot, 'content/Note/untitled.md'), '只有正文\n\n没有标题', 'utf8');
  fs.mkdirSync(path.join(repoRoot, 'source/_posts'), { recursive: true });
  fs.writeFileSync(path.join(repoRoot, 'source/_posts/existing.md'), '# existing\n', 'utf8');

  const result = migrateSamples({
    repoRoot,
    samplePaths: [sourcePath],
    readGitDateLines: () => ['2024-01-03T00:00:00+08:00', '2024-01-01T00:00:00+08:00']
  });

  assert.equal(result.records.length, 1);
  assert.match(result.manualReviewItems[0], /missing title/i);
  assert.equal(fs.existsSync(path.join(repoRoot, 'source/_posts/untitled.md')), false);
  assert.equal(fs.readFileSync(path.join(repoRoot, 'source/_posts/existing.md'), 'utf8'), '# existing\n');
});

test('migrateSamples preserves manual appendix in mapping document', () => {
  const repoRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'migrate-samples-'));
  const sourcePath = 'Note/OOP.md';
  const mappingPath = path.join(repoRoot, 'docs/migration/hexo-sample-mapping.md');

  fs.mkdirSync(path.join(repoRoot, 'Note'), { recursive: true });
  fs.mkdirSync(path.dirname(mappingPath), { recursive: true });
  fs.writeFileSync(path.join(repoRoot, sourcePath), '# OOP\n\n正文', 'utf8');
  fs.writeFileSync(
    mappingPath,
    [
      '# Hexo Sample Mapping',
      '',
      '## 手工附录',
      '',
      '- 这段说明需要在脚本重跑后保留',
      '- 最终验证：已执行',
      ''
    ].join('\n'),
    'utf8'
  );

  migrateSamples({
    repoRoot,
    samplePaths: [sourcePath],
    readGitDateLines: () => ['2024-01-03T00:00:00+08:00', '2024-01-01T00:00:00+08:00']
  });

  const mappingDocument = fs.readFileSync(mappingPath, 'utf8');

  assert.match(mappingDocument, /\| `Note\/OOP\.md` \| `source\/_posts\/OOP\.md` \| `post` \| `Note` \|/);
  assert.match(mappingDocument, /## 手工附录/);
  assert.match(mappingDocument, /这段说明需要在脚本重跑后保留/);
  assert.match(mappingDocument, /最终验证：已执行/);
});

test('migrateSamples reads sample content from content/ directory model', () => {
  const repoRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'migrate-samples-'));

  fs.mkdirSync(path.join(repoRoot, 'content/Note'), { recursive: true });
  fs.writeFileSync(path.join(repoRoot, 'content/Note/OOP.md'), '# OOP\n\n正文', 'utf8');

  const result = migrateSamples({
    repoRoot,
    samplePaths: ['content/Note/OOP.md'],
    readGitDateLines: () => ['2024-01-03T00:00:00+08:00', '2024-01-01T00:00:00+08:00']
  });

  assert.equal(result.records.length, 1);
  assert.equal(result.records[0].sourcePath, 'content/Note/OOP.md');
  assert.equal(result.records[0].targetPath, 'source/_posts/OOP.md');
  assert.match(
    fs.readFileSync(path.join(repoRoot, 'docs/migration/hexo-sample-mapping.md'), 'utf8'),
    /\| `content\/Note\/OOP\.md` \| `source\/_posts\/OOP\.md` \| `post` \| `Note` \|/
  );
});

test('migrateSamples resolves legacy sample-set paths against content/ directory', () => {
  const repoRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'migrate-samples-'));

  fs.mkdirSync(path.join(repoRoot, 'content/Note'), { recursive: true });
  fs.writeFileSync(path.join(repoRoot, 'content/Note/OOP.md'), '# OOP\n\n正文', 'utf8');

  const result = migrateSamples({
    repoRoot,
    samplePaths: ['Note/OOP.md'],
    readGitDateLines: () => ['2024-01-03T00:00:00+08:00', '2024-01-01T00:00:00+08:00']
  });

  assert.equal(result.records.length, 1);
  assert.equal(result.records[0].sourcePath, 'content/Note/OOP.md');
  assert.equal(result.records[0].frontMatter.categories[0], 'Note');
});

test('renderSampleMappingDocument states sample regression scope without formal source output responsibility', () => {
  const document = renderSampleMappingDocument({
    records: [],
    manualReviewItems: []
  });

  assert.match(document, /样本回归入口/);
  assert.match(document, /仅用于验证少量样本映射规则/);
  assert.doesNotMatch(document, /成功生成 Hexo 目标文件/);
});
