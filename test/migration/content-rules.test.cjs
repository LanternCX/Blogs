const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

function loadSubject() {
  return require('../../scripts/migration/content-rules.cjs');
}

function makeFixture() {
  const rootDir = fs.mkdtempSync(path.join(os.tmpdir(), 'content-rules-'));

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

test('createContentRules exposes the fixed blog directory whitelist', () => {
  const { createContentRules, BLOG_DIRECTORY_WHITELIST } = loadSubject();
  const fixture = makeFixture();

  const rules = createContentRules({ rootDir: fixture.rootDir });

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
  assert.deepEqual(rules.directories, BLOG_DIRECTORY_WHITELIST);
});

test('createContentRules classifies Pages markdown as page and other whitelisted markdown as post', () => {
  const { createContentRules } = loadSubject();
  const fixture = makeFixture();

  fixture.write('content/Pages/about.md', '# about');
  fixture.write('content/Note/OOP.md', '# oop');

  const rules = createContentRules({ rootDir: fixture.rootDir });

  assert.deepEqual(rules.classify('content/Pages/about.md'), {
    include: true,
    kind: 'page'
  });
  assert.deepEqual(rules.classify('content/Note/OOP.md'), {
    include: true,
    kind: 'post'
  });
});

test('createContentRules excludes marp markdown and README by default', () => {
  const { createContentRules } = loadSubject();
  const fixture = makeFixture();

  fixture.write('content/Note/talk.marp.md', '# slides');
  fixture.write('content/Note/README.md', '# readme');

  const rules = createContentRules({ rootDir: fixture.rootDir });

  assert.deepEqual(rules.classify('content/Note/talk.marp.md'), { include: false });
  assert.deepEqual(rules.classify('content/Note/README.md'), { include: false });
});

test('createContentRules includes whitelisted README but still excludes content/Pages/README.md', () => {
  const { createContentRules } = loadSubject();
  const fixture = makeFixture();

  fixture.write('content/Note/README.md', '# readme');
  fixture.write('content/Pages/README.md', '# pages');
  fixture.write(
    '.migration/include-readmes.json',
    JSON.stringify({
      paths: ['content/Note/README.md', 'content/Pages/README.md']
    }, null, 2)
  );

  const rules = createContentRules({ rootDir: fixture.rootDir });

  assert.deepEqual(rules.classify('content/Note/README.md'), {
    include: true,
    kind: 'post'
  });
  assert.deepEqual(rules.classify('content/Pages/README.md'), { include: false });
});

test('createContentRules accepts a normalized nested README path under a whitelisted blog directory', () => {
  const { createContentRules } = loadSubject();
  const fixture = makeFixture();

  fixture.write('content/Note/guides/testing/README.md', '# nested readme');
  fixture.write(
    '.migration/include-readmes.json',
    JSON.stringify({
      paths: ['content/Note/guides/testing/README.md']
    }, null, 2)
  );

  const rules = createContentRules({ rootDir: fixture.rootDir });

  assert.deepEqual([...rules.includeReadmes], ['content/Note/guides/testing/README.md']);
  assert.deepEqual(rules.classify('content/Note/guides/testing/README.md'), {
    include: true,
    kind: 'post'
  });
});

test('createContentRules treats a missing README whitelist file as empty', () => {
  const { createContentRules } = loadSubject();
  const fixture = makeFixture();

  fixture.write('content/Agent/README.md', '# agent');

  const rules = createContentRules({ rootDir: fixture.rootDir });

  assert.deepEqual([...rules.includeReadmes], []);
  assert.deepEqual(rules.classify('content/Agent/README.md'), { include: false });
});

test('createContentRules rejects invalid whitelist file shapes and paths', () => {
  const { createContentRules } = loadSubject();

  assert.throws(() => {
    const fixture = makeFixture();
    fixture.write('.migration/include-readmes.json', '{');
    createContentRules({ rootDir: fixture.rootDir });
  }, /invalid JSON/i);

  assert.throws(() => {
    const fixture = makeFixture();
    fixture.write('.migration/include-readmes.json', JSON.stringify({}));
    createContentRules({ rootDir: fixture.rootDir });
  }, /paths/i);

  assert.throws(() => {
    const fixture = makeFixture();
    fixture.write('.migration/include-readmes.json', JSON.stringify({ paths: 'content/Note/README.md' }));
    createContentRules({ rootDir: fixture.rootDir });
  }, /paths/i);

  assert.throws(() => {
    const fixture = makeFixture();
    fixture.write('.migration/include-readmes.json', JSON.stringify({ paths: [42] }));
    createContentRules({ rootDir: fixture.rootDir });
  }, /string/i);

  assert.throws(() => {
    const fixture = makeFixture();
    fixture.write('content/Note/README.md', '# readme');
    fixture.write(
      '.migration/include-readmes.json',
      JSON.stringify({ paths: ['content/Note/README.md', 'content/Note/README.md'] })
    );
    createContentRules({ rootDir: fixture.rootDir });
  }, /duplicate/i);

  assert.throws(() => {
    const fixture = makeFixture();
    fixture.write('content/Note/index.md', '# not readme');
    fixture.write(
      '.migration/include-readmes.json',
      JSON.stringify({ paths: ['content/Note/index.md'] })
    );
    createContentRules({ rootDir: fixture.rootDir });
  }, /README\.md/i);

  assert.throws(() => {
    const fixture = makeFixture();
    fixture.write('content/Misc/README.md', '# other');
    fixture.write(
      '.migration/include-readmes.json',
      JSON.stringify({ paths: ['content/Misc/README.md'] })
    );
    createContentRules({ rootDir: fixture.rootDir });
  }, /whitelist/i);

  assert.throws(() => {
    const fixture = makeFixture();
    fixture.write(
      '.migration/include-readmes.json',
      JSON.stringify({ paths: ['content/Note/README.md'] })
    );
    createContentRules({ rootDir: fixture.rootDir });
  }, /exist/i);

  assert.throws(() => {
    const fixture = makeFixture();
    fixture.write('content/Note/README.md', '# readme');
    fixture.write(
      '.migration/include-readmes.json',
      JSON.stringify({ paths: ['./content/Note/README.md'] })
    );
    createContentRules({ rootDir: fixture.rootDir });
  }, /normalized/i);

  assert.throws(() => {
    const fixture = makeFixture();
    fixture.write('content/Note/README.md', '# readme');
    fixture.write(
      '.migration/include-readmes.json',
      JSON.stringify({ paths: ['content\\Note\\README.md'] })
    );
    createContentRules({ rootDir: fixture.rootDir });
  }, /normalized/i);

  assert.throws(() => {
    const fixture = makeFixture();
    fixture.write('content/Note/README.md', '# readme');
    fixture.write(
      '.migration/include-readmes.json',
      JSON.stringify({ paths: ['content/Note/../Note/README.md'] })
    );
    createContentRules({ rootDir: fixture.rootDir });
  }, /normalized/i);
});
