const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

function loadSubject() {
  delete require.cache[require.resolve('../../scripts/migration/source-cleanup.cjs')];
  return require('../../scripts/migration/source-cleanup.cjs');
}

function makeFixture() {
  const rootDir = fs.mkdtempSync(path.join(os.tmpdir(), 'source-cleanup-'));

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

test('cleanupManagedSource only removes source/_posts and leaves sibling source directories untouched', () => {
  const { cleanupManagedSource } = loadSubject();
  const fixture = makeFixture();

  fixture.write('source/_posts/hello.md', '# hello\n');
  fixture.write('source/about/index.md', '# about\n');
  fixture.write('source/manual/index.md', '# manual\n');

  const result = cleanupManagedSource({ rootDir: fixture.rootDir });

  assert.deepEqual(result.removedPaths, ['source/_posts']);
  assert.equal(fs.existsSync(path.join(fixture.rootDir, 'source/_posts')), false);
  assert.equal(fs.existsSync(path.join(fixture.rootDir, 'source/about')), true);
  assert.equal(fs.existsSync(path.join(fixture.rootDir, 'source/manual')), true);
});

test('cleanupManagedSource removes only page directories listed in the pages manifest', () => {
  const { cleanupManagedSource } = loadSubject();
  const fixture = makeFixture();

  fixture.write('source/_posts/post.md', '# post\n');
  fixture.write('source/about/index.md', '# about\n');
  fixture.write('source/projects/demo/index.md', '# demo\n');
  fixture.write('source/contact/index.md', '# contact\n');
  fixture.write(
    '.migration/pages-manifest.json',
    JSON.stringify({
      paths: ['source/about', 'source/projects/demo']
    }, null, 2)
  );

  const result = cleanupManagedSource({ rootDir: fixture.rootDir });

  assert.deepEqual(result.removedPaths, [
    'source/_posts',
    'source/about',
    'source/projects/demo'
  ]);
  assert.equal(fs.existsSync(path.join(fixture.rootDir, 'source/_posts')), false);
  assert.equal(fs.existsSync(path.join(fixture.rootDir, 'source/about')), false);
  assert.equal(fs.existsSync(path.join(fixture.rootDir, 'source/projects/demo')), false);
  assert.equal(fs.existsSync(path.join(fixture.rootDir, 'source/contact')), true);
});

test('cleanupManagedSource treats a missing pages manifest as an empty page list', () => {
  const { cleanupManagedSource } = loadSubject();
  const fixture = makeFixture();

  fixture.write('source/_posts/post.md', '# post\n');
  fixture.write('source/about/index.md', '# about\n');

  const result = cleanupManagedSource({ rootDir: fixture.rootDir });

  assert.deepEqual(result.removedPaths, ['source/_posts']);
  assert.equal(fs.existsSync(path.join(fixture.rootDir, 'source/_posts')), false);
  assert.equal(fs.existsSync(path.join(fixture.rootDir, 'source/about')), true);
});

test('cleanupManagedSource does not remove manually maintained directories outside the manifest', () => {
  const { cleanupManagedSource } = loadSubject();
  const fixture = makeFixture();

  fixture.write('source/_posts/post.md', '# post\n');
  fixture.write('source/about/index.md', '# about\n');
  fixture.write('source/manual/index.md', '# manual\n');
  fixture.write(
    '.migration/pages-manifest.json',
    JSON.stringify({
      paths: ['source/about']
    }, null, 2)
  );

  const result = cleanupManagedSource({ rootDir: fixture.rootDir });

  assert.deepEqual(result.removedPaths, ['source/_posts', 'source/about']);
  assert.equal(fs.existsSync(path.join(fixture.rootDir, 'source/about')), false);
  assert.equal(fs.existsSync(path.join(fixture.rootDir, 'source/manual')), true);
});
