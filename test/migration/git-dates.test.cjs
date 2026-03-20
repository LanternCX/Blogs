const test = require('node:test');
const assert = require('node:assert/strict');

function loadSubject() {
  return require('../../scripts/migration/git-dates.cjs');
}

test('buildGitDateCommand builds git log command for a source file', () => {
  const { buildGitDateCommand } = loadSubject();

  assert.equal(
    buildGitDateCommand('Note/OOP.md'),
    'git log --format=%aI -- "Note/OOP.md"'
  );
});

test('normalizeGitDates returns created and updated timestamps', () => {
  const { normalizeGitDates } = loadSubject();
  const raw = {
    lines: ['2024-03-05T10:00:00+08:00', '2024-01-02T09:30:00+08:00']
  };

  assert.deepEqual(normalizeGitDates(raw), {
    date: '2024-01-02T09:30:00+08:00',
    updated: '2024-03-05T10:00:00+08:00'
  });
});

test('normalizeGitDates throws when git output is empty', () => {
  const { normalizeGitDates } = loadSubject();

  assert.throws(() => normalizeGitDates({ lines: [] }), /Missing git author dates/);
});
