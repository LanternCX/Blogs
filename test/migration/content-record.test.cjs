const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const { createContentRules } = require('../../scripts/migration/content-rules.cjs');

const REPO_ROOT = path.resolve(__dirname, '..', '..');

function loadSubject() {
  return require('../../scripts/migration/content-record.cjs');
}

function makeGitMeta() {
  return {
    date: '2024-01-02T09:30:00+08:00',
    updated: '2024-03-05T10:00:00+08:00'
  };
}

function makeContentRules() {
  return createContentRules({ rootDir: REPO_ROOT });
}

function makeFixture() {
  const rootDir = fs.mkdtempSync(path.join(os.tmpdir(), 'content-record-'));

  return {
    rootDir,
    write(relativePath, content = '') {
      const filePath = path.join(rootDir, relativePath);
      fs.mkdirSync(path.dirname(filePath), { recursive: true });
      fs.writeFileSync(filePath, content);
      return filePath;
    }
  };
}

test('buildContentRecord returns a success record for a post with complete metadata', () => {
  const { buildContentRecord } = loadSubject();

  const record = buildContentRecord({
    sourcePath: 'content/Note/OOP.md',
    markdown: '# OOP\n\n正文\n',
    gitMeta: makeGitMeta(),
    existingTargetPaths: new Set()
  });

  assert.deepEqual(record, {
    sourcePath: 'content/Note/OOP.md',
    kind: 'post',
    category: 'Note',
    targetPath: 'source/_posts/OOP.md',
    frontMatter: {
      title: 'OOP',
      date: '2024-01-02T09:30:00+08:00',
      updated: '2024-03-05T10:00:00+08:00',
      categories: ['Note']
    },
    body: '# OOP\n\n正文\n',
    resultKind: 'success',
    reason: null
  });
});

test('buildContentRecord marks missing title as manual_review_unwritten', () => {
  const { buildContentRecord } = loadSubject();

  const record = buildContentRecord({
    sourcePath: 'content/Note/OOP.md',
    markdown: '只有正文\n',
    gitMeta: makeGitMeta(),
    existingTargetPaths: new Set()
  });

  assert.equal(record.resultKind, 'manual_review_unwritten');
  assert.equal(record.reason, 'missing_title');
  assert.deepEqual(record.frontMatter, {
    date: '2024-01-02T09:30:00+08:00',
    updated: '2024-03-05T10:00:00+08:00',
    categories: ['Note']
  });
});

test('buildContentRecord marks missing git timestamps as degraded', () => {
  const { buildContentRecord } = loadSubject();

  const record = buildContentRecord({
    sourcePath: 'content/Note/OOP.md',
    markdown: '# OOP\n\n正文\n',
    gitMeta: null,
    existingTargetPaths: new Set()
  });

  assert.equal(record.resultKind, 'degraded');
  assert.equal(record.reason, 'missing_git_dates');
  assert.deepEqual(record.frontMatter, {
    title: 'OOP',
    categories: ['Note']
  });
});

test('buildContentRecord marks conflicting target paths as manual_review_unwritten', () => {
  const { buildContentRecord } = loadSubject();

  const record = buildContentRecord({
    sourcePath: 'content/Note/OOP.md',
    markdown: '# OOP\n\n正文\n',
    gitMeta: makeGitMeta(),
    existingTargetPaths: new Set(['source/_posts/OOP.md'])
  });

  assert.equal(record.resultKind, 'manual_review_unwritten');
  assert.equal(record.reason, 'target_path_conflict');
});

test('buildContentRecord marks nested page paths as manual_review_unwritten', () => {
  const { buildContentRecord } = loadSubject();
  const contentRules = makeContentRules();

  const record = buildContentRecord({
    sourcePath: 'content/Pages/guides/install.md',
    markdown: '# Install\n\n正文\n',
    gitMeta: makeGitMeta(),
    existingTargetPaths: new Set(),
    contentRules
  });

  assert.equal(record.kind, 'post');
  assert.equal(record.category, 'Pages');
  assert.equal(record.targetPath, 'source/_posts/install.md');
  assert.equal(record.resultKind, 'manual_review_unwritten');
  assert.equal(record.reason, 'nested_page_path');
});

test('buildContentRecord marks illegal page slugs as manual_review_unwritten', () => {
  const { buildContentRecord } = loadSubject();

  const badPageRecord = buildContentRecord({
    sourcePath: 'content/Pages/..md',
    markdown: '# About\n\n正文\n',
    gitMeta: makeGitMeta(),
    existingTargetPaths: new Set()
  });

  assert.equal(badPageRecord.resultKind, 'manual_review_unwritten');
  assert.equal(badPageRecord.reason, 'illegal_slug');
  assert.equal(badPageRecord.targetPath, null);
});

test('buildContentRecord allows post filenames with spaces and ordinary dots', () => {
  const { buildContentRecord } = loadSubject();

  const spacedRecord = buildContentRecord({
    sourcePath: 'content/Note/My Note.md',
    markdown: '# My Note\n\n正文\n',
    gitMeta: makeGitMeta(),
    existingTargetPaths: new Set()
  });
  const dottedRecord = buildContentRecord({
    sourcePath: 'content/Note/v1.2 release.md',
    markdown: '# Release\n\n正文\n',
    gitMeta: makeGitMeta(),
    existingTargetPaths: new Set()
  });

  assert.equal(spacedRecord.resultKind, 'success');
  assert.equal(spacedRecord.targetPath, 'source/_posts/My Note.md');
  assert.equal(dottedRecord.resultKind, 'success');
  assert.equal(dottedRecord.targetPath, 'source/_posts/v1.2 release.md');
});

test('buildContentRecord preserves page basename case to avoid silent slug merging', () => {
  const { buildContentRecord } = loadSubject();

  const record = buildContentRecord({
    sourcePath: 'content/Pages/API.md',
    markdown: '# API\n\n正文\n',
    gitMeta: makeGitMeta(),
    existingTargetPaths: new Set()
  });

  assert.equal(record.resultKind, 'success');
  assert.equal(record.slug, 'API');
  assert.equal(record.targetPath, 'source/API/index.md');
});

test('buildContentRecord uses provided content rules for kind selection', () => {
  const { buildContentRecord } = loadSubject();

  const record = buildContentRecord({
    sourcePath: 'content/Pages/API.md',
    markdown: '# API\n\n正文\n',
    gitMeta: makeGitMeta(),
    existingTargetPaths: new Set(),
    contentRules: {
      classify() {
        return { include: true, kind: 'post' };
      }
    }
  });

  assert.equal(record.kind, 'post');
  assert.equal(record.category, 'Pages');
  assert.equal(record.targetPath, 'source/_posts/API.md');
});

test('buildContentRecord allows real repository style post filenames', () => {
  const { buildContentRecord } = loadSubject();
  const contentRules = makeContentRules();

  const cases = [
    'content/Debug-Lab/Chapter04-Pointer&Struct.md',
    'content/Agent/Prompting best practices.zh-CN.md',
    'content/Other/Ignore .DS_Store.md'
  ];

  for (const sourcePath of cases) {
    const record = buildContentRecord({
      sourcePath,
      markdown: '# Title\n\n正文\n',
      gitMeta: makeGitMeta(),
      existingTargetPaths: new Set(),
      contentRules
    });

    assert.equal(record.resultKind, 'success');
    assert.match(record.targetPath, /^source\/_posts\//);
  }
});

test('buildContentRecord rejects marp markdown excluded by content rules', () => {
  const { buildContentRecord } = loadSubject();
  const contentRules = makeContentRules();

  assert.throws(() => {
    buildContentRecord({
      sourcePath: 'content/Agent/Vibecoding.marp.md',
      markdown: '# Vibecoding\n\n正文\n',
      gitMeta: makeGitMeta(),
      existingTargetPaths: new Set(),
      contentRules
    });
  }, /excluded/i);
});

test('buildContentRecord rejects Pages README excluded by content rules', () => {
  const { buildContentRecord } = loadSubject();
  const contentRules = makeContentRules();

  assert.throws(() => {
    buildContentRecord({
      sourcePath: 'content/Pages/README.md',
      markdown: '# README\n\n正文\n',
      gitMeta: makeGitMeta(),
      existingTargetPaths: new Set(),
      contentRules
    });
  }, /excluded/i);
});

test('buildContentRecord allows README included by include-readmes whitelist', () => {
  const { buildContentRecord } = loadSubject();
  const fixture = makeFixture();

  fixture.write('content/Agent/README.md', '# Agent README\n\n正文\n');
  fixture.write(
    '.migration/include-readmes.json',
    JSON.stringify({ paths: ['content/Agent/README.md'] }, null, 2)
  );

  const contentRules = createContentRules({ rootDir: fixture.rootDir });
  const record = buildContentRecord({
    sourcePath: 'content/Agent/README.md',
    markdown: '# Agent README\n\n正文\n',
    gitMeta: makeGitMeta(),
    existingTargetPaths: new Set(),
    contentRules
  });

  assert.equal(record.kind, 'post');
  assert.equal(record.category, 'Agent');
  assert.equal(record.targetPath, 'source/_posts/README.md');
  assert.equal(record.resultKind, 'success');
});
