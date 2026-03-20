const test = require('node:test');
const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');
const { existsSync, readFileSync } = require('node:fs');

test('hexo generate renders pages without raw EJS template markers', () => {
  const clean = spawnSync('npm', ['run', 'hexo:clean'], {
    cwd: process.cwd(),
    encoding: 'utf8'
  });

  assert.equal(clean.status, 0, clean.stderr || clean.stdout);

  const generate = spawnSync('npm', ['run', 'hexo:generate'], {
    cwd: process.cwd(),
    encoding: 'utf8'
  });

  assert.equal(generate.status, 0, generate.stderr || generate.stdout);

  const files = [
    {
      path: 'public/index.html',
      signals: ['<title>Caoxin Blog</title>', '/2026/01/11/OOP/']
    },
    {
      path: 'public/about/index.html',
      signals: ['关于这个小站', '欢迎你来到我的小站']
    },
    {
      path: 'public/friends/index.html',
      signals: ['友链互换 Link Exchange', '欢迎你的来访']
    },
    {
      path: 'public/categories/Note/index.html',
      signals: ['Note', '/2026/01/11/OOP/']
    },
    {
      path: 'public/archives/index.html',
      signals: ['Archives', '/2026/01/11/OOP/']
    }
  ];

  for (const { path, signals } of files) {
    const html = readFileSync(path, 'utf8');
    assert.doesNotMatch(html, /<%[-_=]?\s*partial\(/, path);
    assert.doesNotMatch(html, /<%[-_=]?\s*body\s*%>/, path);
    assert.doesNotMatch(html, /<%[^>]*%>/, path);

    for (const signal of signals) {
      assert.match(html, new RegExp(signal.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')), path);
    }
  }

  assert.equal(existsSync('public/css/style.css'), true, 'public/css/style.css');
  const css = readFileSync('public/css/style.css', 'utf8');
  assert.match(css, /#header|article|body/, 'public/css/style.css');
});
