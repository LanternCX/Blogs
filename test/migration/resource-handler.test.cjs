const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

function loadSubject() {
  delete require.cache[require.resolve('../../scripts/migration/resource-handler.cjs')];
  return require('../../scripts/migration/resource-handler.cjs');
}

function makeFixture() {
  const rootDir = fs.mkdtempSync(path.join(os.tmpdir(), 'resource-handler-'));

  return {
    rootDir,
    write(relativePath, content = '') {
      const filePath = path.join(rootDir, relativePath);
      fs.mkdirSync(path.dirname(filePath), { recursive: true });
      fs.writeFileSync(filePath, content);
      return filePath;
    },
    read(relativePath, encoding = 'utf8') {
      return fs.readFileSync(path.join(rootDir, relativePath), encoding);
    },
    exists(relativePath) {
      return fs.existsSync(path.join(rootDir, relativePath));
    }
  };
}

test('handleExplicitResources copies markdown relative image links for posts and rewrites links', () => {
  const { handleExplicitResources } = loadSubject();
  const fixture = makeFixture();

  fixture.write('content/Note/OOP.md', '# OOP\n\n![Diagram](./assets/diagram.png)\n');
  fixture.write('content/Note/assets/diagram.png', 'diagram');
  fixture.write('content/Note/assets/ignored.txt', 'ignore me');

  const result = handleExplicitResources({
    rootDir: fixture.rootDir,
    sourcePath: 'content/Note/OOP.md',
    targetPath: 'source/_posts/OOP.md',
    kind: 'post',
    markdown: '# OOP\n\n![Diagram](./assets/diagram.png)\n',
    frontMatter: {}
  });

  assert.equal(result.markdown, '# OOP\n\n![Diagram](./OOP/assets/diagram.png)\n');
  assert.equal(result.resultKind, 'success');
  assert.equal(result.reason, null);
  assert.deepEqual(result.frontMatter, {});
  assert.ok(fixture.exists('source/_posts/OOP/assets/diagram.png'));
  assert.ok(!fixture.exists('source/_posts/OOP/ignored.txt'));
});

test('handleExplicitResources copies allowed front matter resource fields and flags unsupported local resource fields as degraded', () => {
  const { handleExplicitResources } = loadSubject();
  const fixture = makeFixture();

  fixture.write('content/Pages/friends.md', '# Friends\n');
  fixture.write('content/Pages/media/cover.png', 'cover');

  const result = handleExplicitResources({
    rootDir: fixture.rootDir,
    sourcePath: 'content/Pages/friends.md',
    targetPath: 'source/friends/index.md',
    kind: 'page',
    markdown: '# Friends\n',
    frontMatter: {
      cover: './media/cover.png',
      summary_image: './media/cover.png'
    }
  });

  assert.deepEqual(result.frontMatter, {
    cover: './media/cover.png',
    summary_image: './media/cover.png'
  });
  assert.equal(result.resultKind, 'degraded');
  assert.equal(result.reason, 'unsupported_front_matter_resource_field');
  assert.deepEqual(result.issues, [
    {
      level: 'degraded',
      reason: 'unsupported_front_matter_resource_field',
      field: 'summary_image'
    }
  ]);
  assert.ok(fixture.exists('source/friends/media/cover.png'));
});

test('handleExplicitResources ignores external links in markdown and front matter', () => {
  const { handleExplicitResources } = loadSubject();
  const fixture = makeFixture();

  fixture.write('content/Note/OOP.md', '# OOP\n\n![CDN](https://cdn.example.com/diagram.png)\n');

  const result = handleExplicitResources({
    rootDir: fixture.rootDir,
    sourcePath: 'content/Note/OOP.md',
    targetPath: 'source/_posts/OOP.md',
    kind: 'post',
    markdown: '# OOP\n\n![CDN](https://cdn.example.com/diagram.png)\n',
    frontMatter: {
      banner: 'https://cdn.example.com/banner.png'
    }
  });

  assert.equal(result.markdown, '# OOP\n\n![CDN](https://cdn.example.com/diagram.png)\n');
  assert.deepEqual(result.frontMatter, {
    banner: 'https://cdn.example.com/banner.png'
  });
  assert.equal(result.resultKind, 'success');
  assert.equal(result.reason, null);
  assert.deepEqual(result.issues, []);
  assert.ok(!fixture.exists('source/_posts/OOP'));
});

test('handleExplicitResources marks missing resources as degraded without rewriting missing links', () => {
  const { handleExplicitResources } = loadSubject();
  const fixture = makeFixture();

  fixture.write('content/Note/OOP.md', '# OOP\n\n![Missing](./assets/missing.png)\n');

  const result = handleExplicitResources({
    rootDir: fixture.rootDir,
    sourcePath: 'content/Note/OOP.md',
    targetPath: 'source/_posts/OOP.md',
    kind: 'post',
    markdown: '# OOP\n\n![Missing](./assets/missing.png)\n',
    frontMatter: {}
  });

  assert.equal(result.markdown, '# OOP\n\n![Missing](./assets/missing.png)\n');
  assert.equal(result.resultKind, 'degraded');
  assert.equal(result.reason, 'missing_resource');
  assert.deepEqual(result.issues, [
    {
      level: 'degraded',
      reason: 'missing_resource',
      source: 'content/Note/assets/missing.png'
    }
  ]);
});

test('handleExplicitResources marks copy conflicts as degraded', () => {
  const { handleExplicitResources } = loadSubject();
  const fixture = makeFixture();

  fixture.write('content/Note/OOP.md', '# OOP\n\n![Diagram](./assets/diagram.png)\n');
  fixture.write('content/Note/assets/diagram.png', 'new diagram');
  fixture.write('source/_posts/OOP/assets/diagram.png', 'old diagram');

  const result = handleExplicitResources({
    rootDir: fixture.rootDir,
    sourcePath: 'content/Note/OOP.md',
    targetPath: 'source/_posts/OOP.md',
    kind: 'post',
    markdown: '# OOP\n\n![Diagram](./assets/diagram.png)\n',
    frontMatter: {}
  });

  assert.equal(result.markdown, '# OOP\n\n![Diagram](./assets/diagram.png)\n');
  assert.equal(result.resultKind, 'degraded');
  assert.equal(result.reason, 'resource_target_conflict');
  assert.deepEqual(result.issues, [
    {
      level: 'degraded',
      reason: 'resource_target_conflict',
      target: 'source/_posts/OOP/assets/diagram.png'
    }
  ]);
  assert.equal(fixture.read('source/_posts/OOP/assets/diagram.png'), 'old diagram');
});

test('handleExplicitResources rewrites links idempotently when rerun on migrated content', () => {
  const { handleExplicitResources } = loadSubject();
  const fixture = makeFixture();

  fixture.write('content/Note/OOP.md', '# OOP\n\n![Diagram](./assets/diagram.png)\n');
  fixture.write('content/Note/assets/diagram.png', 'diagram');

  const firstPass = handleExplicitResources({
    rootDir: fixture.rootDir,
    sourcePath: 'content/Note/OOP.md',
    targetPath: 'source/_posts/OOP.md',
    kind: 'post',
    markdown: '# OOP\n\n![Diagram](./assets/diagram.png)\n',
    frontMatter: {
      cover: './assets/diagram.png'
    }
  });

  const secondPass = handleExplicitResources({
    rootDir: fixture.rootDir,
    sourcePath: 'content/Note/OOP.md',
    targetPath: 'source/_posts/OOP.md',
    kind: 'post',
    markdown: firstPass.markdown,
    frontMatter: firstPass.frontMatter
  });

  assert.equal(firstPass.resultKind, 'success');
  assert.equal(secondPass.markdown, firstPass.markdown);
  assert.deepEqual(secondPass.frontMatter, firstPass.frontMatter);
  assert.equal(secondPass.resultKind, 'success');
  assert.deepEqual(secondPass.issues, []);
  assert.equal(fixture.read('source/_posts/OOP/assets/diagram.png'), 'diagram');
});

test('handleExplicitResources ignores unsupported front matter fields when value is plain text', () => {
  const { handleExplicitResources } = loadSubject();
  const fixture = makeFixture();

  fixture.write('content/Pages/friends.md', '# Friends\n');

  const result = handleExplicitResources({
    rootDir: fixture.rootDir,
    sourcePath: 'content/Pages/friends.md',
    targetPath: 'source/friends/index.md',
    kind: 'page',
    markdown: '# Friends\n',
    frontMatter: {
      summary_image: 'this is just text'
    }
  });

  assert.deepEqual(result.frontMatter, {
    summary_image: 'this is just text'
  });
  assert.equal(result.resultKind, 'success');
  assert.equal(result.reason, null);
  assert.deepEqual(result.issues, []);
});

test('handleExplicitResources marks unsupported front matter local resource paths as degraded without blocking write', () => {
  const { handleExplicitResources } = loadSubject();
  const fixture = makeFixture();

  fixture.write('content/Pages/friends.md', '# Friends\n');

  const result = handleExplicitResources({
    rootDir: fixture.rootDir,
    sourcePath: 'content/Pages/friends.md',
    targetPath: 'source/friends/index.md',
    kind: 'page',
    markdown: '# Friends\n',
    frontMatter: {
      summary_image: './media/cover.png'
    }
  });

  assert.deepEqual(result.frontMatter, {
    summary_image: './media/cover.png'
  });
  assert.equal(result.resultKind, 'degraded');
  assert.equal(result.reason, 'unsupported_front_matter_resource_field');
  assert.deepEqual(result.issues, [
    {
      level: 'degraded',
      reason: 'unsupported_front_matter_resource_field',
      field: 'summary_image'
    }
  ]);
  assert.ok(!fixture.exists('source/friends/media/cover.png'));
});

test('handleExplicitResources normalizes windows style relative resource paths before copying', () => {
  const { handleExplicitResources } = loadSubject();
  const fixture = makeFixture();

  fixture.write('content/Note/OOP.md', '# OOP\n\n![Diagram](.\\img\\a.png)\n');
  fixture.write('content/Note/img/a.png', 'diagram');

  const result = handleExplicitResources({
    rootDir: fixture.rootDir,
    sourcePath: 'content/Note/OOP.md',
    targetPath: 'source/_posts/OOP.md',
    kind: 'post',
    markdown: '# OOP\n\n![Diagram](.\\img\\a.png)\n',
    frontMatter: {}
  });

  assert.equal(result.markdown, '# OOP\n\n![Diagram](./OOP/img/a.png)\n');
  assert.equal(result.resultKind, 'success');
  assert.equal(result.reason, null);
  assert.deepEqual(result.issues, []);
  assert.ok(fixture.exists('source/_posts/OOP/img/a.png'));
});

test('handleExplicitResources leaves allowed front matter non-relative values untouched', () => {
  const { handleExplicitResources } = loadSubject();
  const fixture = makeFixture();

  fixture.write('content/Note/OOP.md', '# OOP\n');

  const result = handleExplicitResources({
    rootDir: fixture.rootDir,
    sourcePath: 'content/Note/OOP.md',
    targetPath: 'source/_posts/OOP.md',
    kind: 'post',
    markdown: '# OOP\n',
    frontMatter: {
      cover: 'cover.png'
    }
  });

  assert.deepEqual(result.frontMatter, {
    cover: 'cover.png'
  });
  assert.equal(result.resultKind, 'success');
  assert.equal(result.reason, null);
  assert.deepEqual(result.issues, []);
  assert.ok(!fixture.exists('source/_posts/OOP/cover.png'));
});

test('handleExplicitResources degrades windows absolute paths without treating them as missing relative resources', () => {
  const { handleExplicitResources } = loadSubject();
  const fixture = makeFixture();

  fixture.write('content/Note/OOP.md', '# OOP\n');

  const result = handleExplicitResources({
    rootDir: fixture.rootDir,
    sourcePath: 'content/Note/OOP.md',
    targetPath: 'source/_posts/OOP.md',
    kind: 'post',
    markdown: '# OOP\n',
    frontMatter: {
      cover: 'C:\\Users\\demo\\cover.png'
    }
  });

  assert.deepEqual(result.frontMatter, {
    cover: 'C:\\Users\\demo\\cover.png'
  });
  assert.equal(result.resultKind, 'degraded');
  assert.equal(result.reason, 'non_relative_resource_path');
  assert.deepEqual(result.issues, [
    {
      level: 'degraded',
      reason: 'non_relative_resource_path',
      field: 'cover',
      value: 'C:\\Users\\demo\\cover.png'
    }
  ]);
});

test('handleExplicitResources copies markdown relative attachment links for posts', () => {
  const { handleExplicitResources } = loadSubject();
  const fixture = makeFixture();

  fixture.write('content/Note/OOP.md', '# OOP\n\n[Spec](./files/spec.pdf)\n');
  fixture.write('content/Note/files/spec.pdf', 'pdf');

  const result = handleExplicitResources({
    rootDir: fixture.rootDir,
    sourcePath: 'content/Note/OOP.md',
    targetPath: 'source/_posts/OOP.md',
    kind: 'post',
    markdown: '# OOP\n\n[Spec](./files/spec.pdf)\n',
    frontMatter: {}
  });

  assert.equal(result.markdown, '# OOP\n\n[Spec](./OOP/files/spec.pdf)\n');
  assert.equal(result.resultKind, 'success');
  assert.equal(result.reason, null);
  assert.deepEqual(result.issues, []);
  assert.ok(fixture.exists('source/_posts/OOP/files/spec.pdf'));
});

test('handleExplicitResources copies markdown resource paths containing spaces', () => {
  const { handleExplicitResources } = loadSubject();
  const fixture = makeFixture();

  fixture.write('content/Note/OOP.md', '# OOP\n\n![Diagram](./img/my diagram.png)\n');
  fixture.write('content/Note/img/my diagram.png', 'diagram');

  const result = handleExplicitResources({
    rootDir: fixture.rootDir,
    sourcePath: 'content/Note/OOP.md',
    targetPath: 'source/_posts/OOP.md',
    kind: 'post',
    markdown: '# OOP\n\n![Diagram](./img/my diagram.png)\n',
    frontMatter: {}
  });

  assert.equal(result.markdown, '# OOP\n\n![Diagram](./OOP/img/my diagram.png)\n');
  assert.equal(result.resultKind, 'success');
  assert.equal(result.reason, null);
  assert.deepEqual(result.issues, []);
  assert.ok(fixture.exists('source/_posts/OOP/img/my diagram.png'));
});

test('handleExplicitResources degrades markdown windows absolute paths instead of treating them as migrated', () => {
  const { handleExplicitResources } = loadSubject();
  const fixture = makeFixture();

  fixture.write('content/Note/OOP.md', '# OOP\n\n![Diagram](C:\\Users\\demo\\diagram.png)\n');

  const result = handleExplicitResources({
    rootDir: fixture.rootDir,
    sourcePath: 'content/Note/OOP.md',
    targetPath: 'source/_posts/OOP.md',
    kind: 'post',
    markdown: '# OOP\n\n![Diagram](C:\\Users\\demo\\diagram.png)\n',
    frontMatter: {}
  });

  assert.equal(result.markdown, '# OOP\n\n![Diagram](C:\\Users\\demo\\diagram.png)\n');
  assert.equal(result.resultKind, 'degraded');
  assert.equal(result.reason, 'non_relative_resource_path');
  assert.deepEqual(result.issues, [
    {
      level: 'degraded',
      reason: 'non_relative_resource_path',
      value: 'C:\\Users\\demo\\diagram.png'
    }
  ]);
});

test('handleExplicitResources rewrites page markdown resource links into page asset directory', () => {
  const { handleExplicitResources } = loadSubject();
  const fixture = makeFixture();

  fixture.write('content/Pages/friends.md', '# Friends\n\n![Logo](./media/logo.png)\n');
  fixture.write('content/Pages/media/logo.png', 'logo');

  const result = handleExplicitResources({
    rootDir: fixture.rootDir,
    sourcePath: 'content/Pages/friends.md',
    targetPath: 'source/friends/index.md',
    kind: 'page',
    markdown: '# Friends\n\n![Logo](./media/logo.png)\n',
    frontMatter: {}
  });

  assert.equal(result.markdown, '# Friends\n\n![Logo](./media/logo.png)\n');
  assert.equal(result.resultKind, 'success');
  assert.equal(result.reason, null);
  assert.deepEqual(result.issues, []);
  assert.ok(fixture.exists('source/friends/media/logo.png'));
});

test('handleExplicitResources degrades leading slash local paths instead of skipping them as external', () => {
  const { handleExplicitResources } = loadSubject();
  const fixture = makeFixture();

  fixture.write('content/Note/OOP.md', '# OOP\n\n![Logo](/static/logo.png)\n');

  const result = handleExplicitResources({
    rootDir: fixture.rootDir,
    sourcePath: 'content/Note/OOP.md',
    targetPath: 'source/_posts/OOP.md',
    kind: 'post',
    markdown: '# OOP\n\n![Logo](/static/logo.png)\n',
    frontMatter: {
      cover: '/static/cover.png'
    }
  });

  assert.equal(result.markdown, '# OOP\n\n![Logo](/static/logo.png)\n');
  assert.deepEqual(result.frontMatter, {
    cover: '/static/cover.png'
  });
  assert.equal(result.resultKind, 'degraded');
  assert.equal(result.reason, 'non_relative_resource_path');
  assert.deepEqual(result.issues, [
    {
      level: 'degraded',
      reason: 'non_relative_resource_path',
      field: 'cover',
      value: '/static/cover.png'
    },
    {
      level: 'degraded',
      reason: 'non_relative_resource_path',
      value: '/static/logo.png'
    }
  ]);
});

test('handleExplicitResources keeps parent relative resources inside post asset directory', () => {
  const { handleExplicitResources } = loadSubject();
  const fixture = makeFixture();

  fixture.write('content/Note/posts/OOP.md', '# OOP\n\n![Diagram](../shared/diagram.png)\n');
  fixture.write('content/Note/shared/diagram.png', 'diagram');

  const result = handleExplicitResources({
    rootDir: fixture.rootDir,
    sourcePath: 'content/Note/posts/OOP.md',
    targetPath: 'source/_posts/OOP.md',
    kind: 'post',
    markdown: '# OOP\n\n![Diagram](../shared/diagram.png)\n',
    frontMatter: {}
  });

  assert.equal(result.markdown, '# OOP\n\n![Diagram](./OOP/shared/diagram.png)\n');
  assert.equal(result.resultKind, 'success');
  assert.equal(result.reason, null);
  assert.deepEqual(result.issues, []);
  assert.ok(fixture.exists('source/_posts/OOP/shared/diagram.png'));
  assert.ok(!fixture.exists('source/_posts/shared/diagram.png'));
});

test('handleExplicitResources degrades post resource references that escape allowed source scope', () => {
  const { handleExplicitResources } = loadSubject();
  const fixture = makeFixture();

  fixture.write('content/Note/posts/OOP.md', '# OOP\n\n![Secret](../../secret.txt)\n');
  fixture.write('content/secret.txt', 'secret');

  const result = handleExplicitResources({
    rootDir: fixture.rootDir,
    sourcePath: 'content/Note/posts/OOP.md',
    targetPath: 'source/_posts/OOP.md',
    kind: 'post',
    markdown: '# OOP\n\n![Secret](../../secret.txt)\n',
    frontMatter: {
      cover: '../../secret.txt'
    }
  });

  assert.equal(result.markdown, '# OOP\n\n![Secret](../../secret.txt)\n');
  assert.deepEqual(result.frontMatter, {
    cover: '../../secret.txt'
  });
  assert.equal(result.resultKind, 'degraded');
  assert.equal(result.reason, 'resource_source_out_of_scope');
  assert.deepEqual(result.issues, [
    {
      level: 'degraded',
      reason: 'resource_source_out_of_scope',
      field: 'cover',
      source: 'content/secret.txt'
    },
    {
      level: 'degraded',
      reason: 'resource_source_out_of_scope',
      source: 'content/secret.txt'
    }
  ]);
  assert.ok(!fixture.exists('source/_posts/OOP/secret.txt'));
});

test('handleExplicitResources degrades page resource references that escape page source scope', () => {
  const { handleExplicitResources } = loadSubject();
  const fixture = makeFixture();

  fixture.write('content/Pages/nested/help.md', '# Help\n\n![Secret](../../private.txt)\n');
  fixture.write('content/private.txt', 'secret');

  const result = handleExplicitResources({
    rootDir: fixture.rootDir,
    sourcePath: 'content/Pages/nested/help.md',
    targetPath: 'source/help/index.md',
    kind: 'page',
    markdown: '# Help\n\n![Secret](../../private.txt)\n',
    frontMatter: {}
  });

  assert.equal(result.markdown, '# Help\n\n![Secret](../../private.txt)\n');
  assert.equal(result.resultKind, 'degraded');
  assert.equal(result.reason, 'resource_source_out_of_scope');
  assert.deepEqual(result.issues, [
    {
      level: 'degraded',
      reason: 'resource_source_out_of_scope',
      source: 'content/private.txt'
    }
  ]);
  assert.ok(!fixture.exists('source/help/private.txt'));
});

test('handleExplicitResources ignores markdown image syntax inside fenced code blocks', () => {
  const { handleExplicitResources } = loadSubject();
  const fixture = makeFixture();

  fixture.write('content/Note/OOP.md', '```md\n![Example](./assets/demo.png)\n```\n');
  fixture.write('content/Note/assets/demo.png', 'demo');

  const result = handleExplicitResources({
    rootDir: fixture.rootDir,
    sourcePath: 'content/Note/OOP.md',
    targetPath: 'source/_posts/OOP.md',
    kind: 'post',
    markdown: '```md\n![Example](./assets/demo.png)\n```\n',
    frontMatter: {}
  });

  assert.equal(result.markdown, '```md\n![Example](./assets/demo.png)\n```\n');
  assert.equal(result.resultKind, 'success');
  assert.equal(result.reason, null);
  assert.deepEqual(result.issues, []);
  assert.ok(!fixture.exists('source/_posts/OOP/assets/demo.png'));
});
