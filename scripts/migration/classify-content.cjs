const path = require('node:path');

const { createContentRules } = require('./content-rules.cjs');

const REPO_ROOT = path.resolve(__dirname, '..', '..');

function normalizePath(relativePath) {
  return relativePath.replaceAll('\\', '/');
}

function toContentPath(relativePath) {
  const normalizedPath = normalizePath(relativePath);

  if (normalizedPath.startsWith('content/')) {
    return normalizedPath;
  }

  return `content/${normalizedPath}`;
}

function classifyContent(
  relativePath,
  { rootDir = REPO_ROOT, contentRules = createContentRules({ rootDir }) } = {}
) {
  const contentPath = toContentPath(relativePath);
  const classification = contentRules.classify(contentPath);

  if (classification.kind === 'page') {
    return {
      kind: 'page',
      slug: path.posix.basename(contentPath, path.posix.extname(contentPath)).toLowerCase()
    };
  }

  return { kind: 'post' };
}

module.exports = { classifyContent };
