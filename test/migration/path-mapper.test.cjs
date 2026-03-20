const test = require('node:test');
const assert = require('node:assert/strict');

function loadSubject() {
  return require('../../scripts/migration/path-mapper.cjs');
}

test('mapTargetPath maps Pages friends page to source route index file', () => {
  const { mapTargetPath } = loadSubject();

  assert.equal(
    mapTargetPath('Pages/friends.md', { kind: 'page', slug: 'friends' }),
    'source/friends/index.md'
  );
});

test('mapTargetPath keeps post filename under _posts', () => {
  const { mapTargetPath } = loadSubject();

  assert.equal(
    mapTargetPath('Note/OOP.md', { kind: 'post', fileName: 'OOP.md' }),
    'source/_posts/OOP.md'
  );
});
