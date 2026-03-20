const test = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');

test('package manifest includes Hexo homepage generator and theme dependencies', () => {
  const pkg = JSON.parse(readFileSync('package.json', 'utf8'));

  assert.equal(pkg.dependencies['hexo-generator-archive'], '^2.0.0');
  assert.equal(pkg.dependencies['hexo-generator-category'], '^2.0.0');
  assert.equal(pkg.dependencies['hexo-generator-index'], '^4.0.0');
  assert.equal(pkg.dependencies['hexo-renderer-stylus'], '^3.0.1');
  assert.equal(pkg.dependencies['hexo-theme-landscape'], '^1.1.0');
});
