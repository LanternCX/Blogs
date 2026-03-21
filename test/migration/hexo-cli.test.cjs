const test = require('node:test');
const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');
const { existsSync, readFileSync } = require('node:fs');

const REPORT_PATH = 'docs/migration/hexo-full-migration-report.md';

function parseMigrationReport() {
  const markdown = readFileSync(REPORT_PATH, 'utf8');
  const summary = {
    success: Number(markdown.match(/成功迁移数量:\s*(\d+)/)?.[1] ?? -1),
    degraded: Number(markdown.match(/降级迁移数量:\s*(\d+)/)?.[1] ?? -1)
  };
  const successRecords = [];
  const degradedRecords = [];
  let section = null;

  for (const line of markdown.split('\n')) {
    if (line === '## 成功迁移') {
      section = 'success';
      continue;
    }

    if (line === '## 降级迁移') {
      section = 'degraded';
      continue;
    }

    if (line.startsWith('## ')) {
      section = null;
      continue;
    }

    if (!['success', 'degraded'].includes(section) || !line.startsWith('| `content/')) {
      continue;
    }

    const cells = line.split('|').slice(1, -1).map((cell) => cell.trim().replace(/^`|`$/g, ''));
    const record = section === 'success'
      ? {
          sourcePath: cells[0],
          targetPath: cells[1],
          kind: cells[2],
          slug: cells[3],
          status: cells[4]
        }
      : {
          sourcePath: cells[0],
          targetPath: cells[1],
          kind: 'post',
          slug: cells[0].split('/')[1],
          status: 'degraded'
        };

    if (section === 'success') {
      successRecords.push(record);
    } else {
      degradedRecords.push(record);
    }
  }

  return {
    summary,
    successRecords,
    degradedRecords,
    writtenRecords: [...successRecords, ...degradedRecords]
  };
}

test('hexo list post recognizes migrated posts across categories and generates category/archive pages', () => {
  const migrate = spawnSync('npm', ['run', 'migrate:all'], {
    cwd: process.cwd(),
    encoding: 'utf8'
  });

  assert.equal(migrate.status, 0, migrate.stderr || migrate.stdout);
  assert.match(migrate.stdout, /Migrated 39 files and wrote docs\/migration\/hexo-full-migration-report\.md/);

  const clean = spawnSync('npx', ['hexo', 'clean'], {
    cwd: process.cwd(),
    encoding: 'utf8'
  });

  assert.equal(clean.status, 0, clean.stderr || clean.stdout);

  const result = spawnSync('npx', ['hexo', 'list', 'post'], {
    cwd: process.cwd(),
    encoding: 'utf8'
  });
  const report = parseMigrationReport();
  const listedPostLines = result.stdout
    .split('\n')
    .filter((line) => /^\d{4}-\d{2}-\d{2}\s+/.test(line));
  const expectedPosts = report.writtenRecords.filter((record) => record.kind === 'post');

  assert.equal(result.status, 0, result.stderr || result.stdout);
  assert.doesNotMatch(result.stdout, /No posts\./);
  assert.match(result.stdout, /HZCU 2025 Freshman STL/);
  assert.match(result.stdout, /Chapter01-Intro/);
  assert.match(result.stdout, /OOP/);
  assert.equal(report.successRecords.length, report.summary.success, 'success count should match report summary');
  assert.equal(report.degradedRecords.length, report.summary.degraded, 'degraded count should match report summary');
  assert.equal(listedPostLines.length, expectedPosts.length, 'hexo list post count should match report posts');

  for (const record of expectedPosts) {
    const listedPath = record.targetPath.replace(/^source\//, '');
    assert.match(result.stdout, new RegExp(listedPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  }

  const generate = spawnSync('npx', ['hexo', 'generate'], {
    cwd: process.cwd(),
    encoding: 'utf8'
  });

  assert.equal(generate.status, 0, generate.stderr || generate.stdout);
  assert.equal(existsSync('public/categories/index.html'), true, 'public/categories/index.html');
  assert.equal(existsSync('public/archives/index.html'), true, 'public/archives/index.html');
});
