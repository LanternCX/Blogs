const test = require('node:test');
const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');

test('migrate:all completes successfully after full migration is implemented', () => {
  const result = spawnSync('npm', ['run', 'migrate:all'], {
    cwd: process.cwd(),
    encoding: 'utf8'
  });

  assert.equal(result.status, 0, result.stderr || result.stdout);
  assert.match(result.stdout, /Migrated \d+ files and wrote docs\/migration\/hexo-full-migration-report\.md/);
  assert.equal(result.stderr, '');
});

test('migrate-all placeholder does nothing when loaded as a module', () => {
  const result = spawnSync(
    process.execPath,
    ['-e', "require('./scripts/migration/migrate-all.cjs')"],
    {
      cwd: process.cwd(),
      encoding: 'utf8'
    }
  );

  assert.equal(result.status, 0, result.stderr || result.stdout);
  assert.equal(result.stdout, '');
  assert.equal(result.stderr, '');
});
