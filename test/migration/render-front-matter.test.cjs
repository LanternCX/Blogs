const test = require('node:test');
const assert = require('node:assert/strict');
const yaml = require('js-yaml');

function loadSubject() {
  return require('../../scripts/migration/render-front-matter.cjs');
}

test('renderFrontMatterDocument includes yaml front matter fields', () => {
  const { renderFrontMatterDocument } = loadSubject();

  const document = renderFrontMatterDocument({
    frontMatter: {
      title: '第一标题',
      date: '2024-01-02T09:30:00+08:00',
      updated: '2024-03-05T10:00:00+08:00',
      categories: ['Note']
    },
    body: '正文内容\n'
  });

  const [, yamlText] = document.match(/^---\n([\s\S]*?)\n---\n\n/s);

  assert.match(document, /^---\n/);
  assert.deepEqual(yaml.load(yamlText), {
    title: '第一标题',
    date: '2024-01-02T09:30:00+08:00',
    updated: '2024-03-05T10:00:00+08:00',
    categories: ['Note']
  });
  assert.match(document, /---\n\n正文内容\n$/);
});

test('renderFrontMatterDocument serializes yaml-safe scalars through js-yaml', () => {
  const { renderFrontMatterDocument } = loadSubject();

  const document = renderFrontMatterDocument({
    frontMatter: {
      title: '题目: YAML',
      categories: ['Note']
    },
    body: '正文\n'
  });

  const [, yamlText] = document.match(/^---\n([\s\S]*?)\n---\n\n/s);

  assert.deepEqual(yaml.load(yamlText), {
    title: '题目: YAML',
    categories: ['Note']
  });
});

test('renderFrontMatterDocument trims body leading whitespace before appending', () => {
  const { renderFrontMatterDocument } = loadSubject();

  const document = renderFrontMatterDocument({
    frontMatter: {
      title: '第一标题'
    },
    body: '\n\n正文\n'
  });

  assert.match(document, /---\n\n正文\n$/);
});
