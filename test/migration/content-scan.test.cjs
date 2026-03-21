const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

function loadSubject() {
  return require('../../scripts/migration/content-scan.cjs');
}

function makeFixture() {
  const rootDir = fs.mkdtempSync(path.join(os.tmpdir(), 'content-scan-'));

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

test('scanContentCandidates returns structured candidate records from whitelisted content sources', () => {
  const { scanContentCandidates } = loadSubject();
  const fixture = makeFixture();

  fixture.write('content/Note/OOP.md', '# oop');
  fixture.write('content/Agent/talk.marp.md', '# slides');
  fixture.write('content/Other/README.md', '# readme');
  fixture.write('content/ACM-ICPC/README.md', '# allowed readme');
  fixture.write('content/Pages/about.md', '# about');
  fixture.write('content/Misc/ignore.md', '# ignore');
  fixture.write(
    '.migration/include-readmes.json',
    JSON.stringify({ paths: ['content/ACM-ICPC/README.md'] }, null, 2)
  );

  const candidates = scanContentCandidates({ rootDir: fixture.rootDir });

  assert.deepEqual(candidates, [
    {
      sourcePath: 'content/ACM-ICPC/README.md',
      kind: 'post',
      category: 'ACM-ICPC',
      slug: 'README'
    },
    {
      sourcePath: 'content/Note/OOP.md',
      kind: 'post',
      category: 'Note',
      slug: 'OOP'
    },
    {
      sourcePath: 'content/Pages/about.md',
      kind: 'page',
      category: 'Pages',
      slug: 'about'
    }
  ]);
});

test('scanContentCandidates keeps nested Pages markdown as post based on content rules', () => {
  const { scanContentCandidates } = loadSubject();
  const fixture = makeFixture();

  fixture.write('content/Pages/guides/install.md', '# install');

  const candidates = scanContentCandidates({ rootDir: fixture.rootDir });

  assert.deepEqual(candidates, [
    {
      sourcePath: 'content/Pages/guides/install.md',
      kind: 'post',
      category: 'Pages',
      slug: 'install'
    }
  ]);
});
