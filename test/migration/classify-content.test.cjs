const test = require('node:test');
const assert = require('node:assert/strict');

function loadSubject() {
  return require('../../scripts/migration/classify-content.cjs');
}

test('classifyContent maps Pages content to page', () => {
  const { classifyContent } = loadSubject();

  assert.deepEqual(classifyContent('Pages/about.md'), {
    kind: 'page',
    slug: 'about'
  });
});

test('classifyContent maps Note content to post', () => {
  const { classifyContent } = loadSubject();

  assert.equal(classifyContent('Note/OOP.md').kind, 'post');
});

test('classifyContent normalizes windows separators before classification', () => {
  const { classifyContent } = loadSubject();

  assert.deepEqual(classifyContent('Pages\\about.md'), {
    kind: 'page',
    slug: 'about'
  });
});

test('classifyContent only fixes separators and does not rewrite path segments', () => {
  const { classifyContent } = loadSubject();

  assert.equal(classifyContent('Misc/../Pages/about.md').kind, 'post');
});

test('classifyContent uses content rules as the single rule source for content paths', () => {
  const { classifyContent } = loadSubject();

  assert.deepEqual(classifyContent('content/Pages/about.md'), {
    kind: 'page',
    slug: 'about'
  });
});
