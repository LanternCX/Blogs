const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

function loadSubject() {
  return require('../../scripts/migration/collect-git-meta.cjs');
}

function makeFixture() {
  const rootDir = fs.mkdtempSync(path.join(os.tmpdir(), 'collect-git-meta-'));

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

test('collectGitMeta keeps original relative paths as output keys', () => {
  const { collectGitMeta } = loadSubject();
  const fixture = makeFixture();
  const commands = [];

  fixture.write('Note/OOP.md', '# oop');
  fixture.write('source/_posts/ignored.md', '# ignored');
  fixture.write('Misc/skip.md', '# skip');

  const result = collectGitMeta({
    rootDir: fixture.rootDir,
    execCommand(command) {
      commands.push(command);
      return '2024-03-05T10:00:00+08:00\n2024-01-02T09:30:00+08:00\n';
    }
  });

  assert.deepEqual(result, {
    'Note/OOP.md': {
      date: '2024-01-02T09:30:00+08:00',
      updated: '2024-03-05T10:00:00+08:00'
    }
  });
  assert.deepEqual(commands, ['git log --format=%aI -- "Note/OOP.md"']);
});

test('normalizeGitMetaDates uses the same timestamp for date and updated when git log returns one line', () => {
  const { normalizeGitMetaDates } = loadSubject();

  assert.deepEqual(normalizeGitMetaDates(['2024-03-05T10:00:00+08:00']), {
    date: '2024-03-05T10:00:00+08:00',
    updated: '2024-03-05T10:00:00+08:00'
  });
});

test('normalizeGitMetaDates returns null when git log has no timestamps', () => {
  const { normalizeGitMetaDates } = loadSubject();

  assert.equal(normalizeGitMetaDates([]), null);
});
