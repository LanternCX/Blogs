const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

function loadSubject() {
  delete require.cache[require.resolve('../../scripts/migration/content-reorganize.cjs')];
  return require('../../scripts/migration/content-reorganize.cjs');
}

function makeTempDir() {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'content-reorganize-'));
}

function writeFile(filePath, content = '') {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content);
}

test('createReorganizePlan only includes whitelisted top-level blog directories', () => {
  const { BLOG_DIRECTORY_WHITELIST, createReorganizePlan } = loadSubject();

  const plan = createReorganizePlan([
    'ACM-ICPC',
    'Agent',
    'README.md',
    'scripts',
    'Smart Car',
    'source'
  ]);

  assert.deepEqual(BLOG_DIRECTORY_WHITELIST, [
    'ACM-ICPC',
    'Agent',
    'Debug-Lab',
    'EDC',
    'Note',
    'Other',
    'Photography',
    'Robotic',
    'Smart Car',
    'Pages'
  ]);
  assert.deepEqual(plan, [
    { source: 'ACM-ICPC', target: 'content/ACM-ICPC' },
    { source: 'Agent', target: 'content/Agent' },
    { source: 'Smart Car', target: 'content/Smart Car' }
  ]);
});

test('assertNoTargetConflicts throws when a target directory already exists', () => {
  const { assertNoTargetConflicts } = loadSubject();

  assert.throws(
    () =>
      assertNoTargetConflicts([
        { source: 'Note', target: 'content/Note' },
        { source: 'Pages', target: 'content/Pages' }
      ], new Set(['content', 'content/Note'])),
    (error) => {
      assert.equal(error.code, 'TARGET_EXISTS');
      assert.match(error.message, /content\/Note/);
      return true;
    }
  );
});

test('script fails early when root content path is an existing file', () => {
  const repoDir = makeTempDir();

  writeFile(path.join(repoDir, 'Note', 'post.md'), '# post\n');
  writeFile(path.join(repoDir, 'content'), 'not a directory\n');

  let result = spawnSync('git', ['init'], {
    cwd: repoDir,
    encoding: 'utf8'
  });
  assert.equal(result.status, 0, result.stderr || result.stdout);

  result = spawnSync('git', ['add', 'Note/post.md', 'content'], {
    cwd: repoDir,
    encoding: 'utf8'
  });
  assert.equal(result.status, 0, result.stderr || result.stdout);

  result = spawnSync(
    'git',
    ['-c', 'user.name=Test User', '-c', 'user.email=test@example.com', 'commit', '-m', 'init'],
    {
      cwd: repoDir,
      encoding: 'utf8'
    }
  );
  assert.equal(result.status, 0, result.stderr || result.stdout);

  result = spawnSync(
    process.execPath,
    [path.join(process.cwd(), 'scripts/migration/content-reorganize.cjs')],
    {
      cwd: repoDir,
      encoding: 'utf8'
    }
  );

  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /root content path is unavailable/i);
  assert.ok(fs.existsSync(path.join(repoDir, 'Note', 'post.md')));
  assert.ok(fs.statSync(path.join(repoDir, 'content')).isFile());
});

test('script prints git mv plan, moves only whitelisted directories, and leaves others untouched', () => {
  const repoDir = makeTempDir();

  writeFile(path.join(repoDir, 'Note', 'post.md'), '# post\n');
  writeFile(path.join(repoDir, 'Misc', 'keep.txt'), 'keep\n');

  let result = spawnSync('git', ['init'], {
    cwd: repoDir,
    encoding: 'utf8'
  });
  assert.equal(result.status, 0, result.stderr || result.stdout);

  result = spawnSync('git', ['add', 'Note/post.md', 'Misc/keep.txt'], {
    cwd: repoDir,
    encoding: 'utf8'
  });
  assert.equal(result.status, 0, result.stderr || result.stdout);

  result = spawnSync(
    'git',
    ['-c', 'user.name=Test User', '-c', 'user.email=test@example.com', 'commit', '-m', 'init'],
    {
      cwd: repoDir,
      encoding: 'utf8'
    }
  );
  assert.equal(result.status, 0, result.stderr || result.stdout);

  result = spawnSync(
    process.execPath,
    [path.join(process.cwd(), 'scripts/migration/content-reorganize.cjs')],
    {
      cwd: repoDir,
      encoding: 'utf8'
    }
  );

  assert.equal(result.status, 0, result.stderr || result.stdout);
  assert.match(result.stdout, /git mv "Note" "content\/Note"/);
  assert.ok(fs.existsSync(path.join(repoDir, 'content', 'Note', 'post.md')));
  assert.ok(!fs.existsSync(path.join(repoDir, 'Note')));
  assert.ok(fs.existsSync(path.join(repoDir, 'Misc', 'keep.txt')));

  const status = spawnSync('git', ['status', '--short'], {
    cwd: repoDir,
    encoding: 'utf8'
  });
  assert.equal(status.status, 0, status.stderr || status.stdout);
  assert.match(status.stdout, /R\s+Note\/post\.md -> content\/Note\/post\.md/);
  assert.doesNotMatch(status.stdout, /content\/Misc/);
});
