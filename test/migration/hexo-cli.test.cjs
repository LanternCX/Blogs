const test = require('node:test');
const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');

test('hexo list post recognizes the three migrated sample posts', () => {
  const clean = spawnSync('npx', ['hexo', 'clean'], {
    cwd: process.cwd(),
    encoding: 'utf8'
  });

  assert.equal(clean.status, 0, clean.stderr || clean.stdout);

  const result = spawnSync('npx', ['hexo', 'list', 'post'], {
    cwd: process.cwd(),
    encoding: 'utf8'
  });

  assert.equal(result.status, 0, result.stderr || result.stdout);
  assert.doesNotMatch(result.stdout, /No posts\./);
  assert.match(result.stdout, /HZCU 2025 Freshman STL/);
  assert.match(result.stdout, /OOP/);
  assert.match(result.stdout, /智握：语音驱动的视觉抓取智能机械臂/);
});
