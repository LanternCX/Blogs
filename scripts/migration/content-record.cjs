const path = require('node:path');

const { createContentRules } = require('./content-rules.cjs');
const { extractTitle } = require('./extract-title.cjs');
const { mapTargetPath } = require('./path-mapper.cjs');

const REPO_ROOT = path.resolve(__dirname, '..', '..');

function normalizeSourcePath(sourcePath) {
  return sourcePath.replaceAll('\\', '/');
}

function stripContentPrefix(sourcePath) {
  if (sourcePath.startsWith('content/')) {
    return sourcePath.slice('content/'.length);
  }

  return sourcePath;
}

function isNestedPagePath(contentRelativePath) {
  const segments = contentRelativePath.split('/');
  return segments[0] === 'Pages' && segments.length > 2;
}

function deriveRecordMeta(sourcePath, contentRules) {
  const normalizedSourcePath = normalizeSourcePath(sourcePath);
  const contentRelativePath = stripContentPrefix(normalizedSourcePath);
  const classification = contentRules.classify(normalizedSourcePath);

  if (!classification.include) {
    throw new Error(`Source path is excluded by content rules: ${normalizedSourcePath}`);
  }

  if (classification.kind === 'page') {
    return {
      kind: 'page',
      slug: path.posix.basename(contentRelativePath, path.posix.extname(contentRelativePath))
    };
  }

  return {
    kind: 'post',
    category: contentRelativePath.split('/')[0]
  };
}

function hasGitMeta(gitMeta) {
  return Boolean(gitMeta && gitMeta.date && gitMeta.updated);
}

function mapPathReason(error) {
  switch (error && error.code) {
    case 'NESTED_PAGE_PATH':
      return 'nested_page_path';
    case 'ILLEGAL_SLUG':
      return 'illegal_slug';
    case 'ILLEGAL_TARGET_FILENAME':
      return 'illegal_target_filename';
    default:
      throw error;
  }
}

function buildFrontMatter({ kind, category, title, gitMeta }) {
  const frontMatter = {};

  if (title) {
    frontMatter.title = title;
  }

  if (hasGitMeta(gitMeta)) {
    frontMatter.date = gitMeta.date;
    frontMatter.updated = gitMeta.updated;
  }

  if (kind === 'post') {
    frontMatter.categories = [category];
  }

  return frontMatter;
}

function buildContentRecord({
  sourcePath,
  markdown,
  gitMeta,
  existingTargetPaths = new Set(),
  contentRules = createContentRules({ rootDir: REPO_ROOT })
}) {
  const normalizedSourcePath = normalizeSourcePath(sourcePath);
  const contentRelativePath = stripContentPrefix(normalizedSourcePath);
  const classification = deriveRecordMeta(normalizedSourcePath, contentRules);
  const fileName = path.posix.basename(contentRelativePath);
  let title = null;

  try {
    title = extractTitle(markdown);
  } catch {
    title = null;
  }

  const frontMatter = buildFrontMatter({
    kind: classification.kind,
    category: classification.category,
    title,
    gitMeta
  });

  let targetPath = null;
  let resultKind = 'success';
  let reason = null;

  try {
    targetPath = mapTargetPath(normalizedSourcePath, {
      ...classification,
      fileName
    });
  } catch (error) {
    resultKind = 'manual_review_unwritten';
    reason = mapPathReason(error);
  }

  if (targetPath && existingTargetPaths.has(targetPath)) {
    resultKind = 'manual_review_unwritten';
    reason = 'target_path_conflict';
  }

  if (!reason && isNestedPagePath(contentRelativePath)) {
    resultKind = 'manual_review_unwritten';
    reason = 'nested_page_path';
  }

  if (!reason && !title) {
    resultKind = 'manual_review_unwritten';
    reason = 'missing_title';
  }

  if (!reason && !hasGitMeta(gitMeta)) {
    resultKind = 'degraded';
    reason = 'missing_git_dates';
  }

  return {
    sourcePath: normalizedSourcePath,
    kind: classification.kind,
    ...(classification.kind === 'post'
      ? { category: classification.category }
      : { slug: classification.slug }),
    targetPath,
    frontMatter,
    body: markdown,
    resultKind,
    reason
  };
}

module.exports = { buildContentRecord };
