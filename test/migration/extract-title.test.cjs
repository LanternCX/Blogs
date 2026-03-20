const test = require('node:test');
const assert = require('node:assert/strict');

function loadSubject() {
  return require('../../scripts/migration/extract-title.cjs');
}

test('extractTitle reads the first markdown heading after intro text', () => {
  const { extractTitle } = loadSubject();
  const markdown = [
    '这是一段导语。',
    '',
    '## 第一标题',
    '',
    '正文内容',
    '',
    '# 后续标题'
  ].join('\n');

  assert.equal(extractTitle(markdown), '第一标题');
});

test('extractTitle throws when markdown has no heading', () => {
  const { extractTitle } = loadSubject();

  assert.throws(() => extractTitle('只有导语\n\n没有标题'), /Missing markdown heading/);
});

test('extractTitle throws when the first matched heading is empty after trimming', () => {
  const { extractTitle } = loadSubject();

  assert.throws(() => extractTitle('##    \n\n正文'), /Missing markdown heading/);
});

test('extractTitle reads heading content from an indented list item heading', () => {
  const { extractTitle } = loadSubject();

  assert.equal(extractTitle('- # 智握：语音驱动的视觉抓取智能机械臂\n\n正文'), '智握：语音驱动的视觉抓取智能机械臂');
});
