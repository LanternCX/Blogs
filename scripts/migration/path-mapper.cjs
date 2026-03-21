const path = require('node:path');

function createPathMappingError(code, message) {
  const error = new Error(message);
  error.code = code;
  return error;
}

function normalizeSourcePath(sourcePath) {
  return sourcePath.replaceAll('\\', '/');
}

function stripContentPrefix(sourcePath) {
  if (sourcePath.startsWith('content/')) {
    return sourcePath.slice('content/'.length);
  }

  return sourcePath;
}

function isValidSlug(slug) {
  return typeof slug === 'string' && slug.length > 0 && slug !== '.' && slug !== '..' && !slug.includes('/');
}

function isValidTargetFileName(fileName) {
  return typeof fileName === 'string' && fileName.length > 0 && fileName !== '.' && fileName !== '..' && !fileName.includes('/');
}

function mapTargetPath(sourcePath, meta) {
  const normalizedSourcePath = stripContentPrefix(normalizeSourcePath(sourcePath));

  if (meta.kind === 'page') {
    const segments = normalizedSourcePath.split('/');

    if (segments[0] === 'Pages' && segments.length !== 2) {
      throw createPathMappingError('NESTED_PAGE_PATH', 'Nested page paths require manual review');
    }

    if (!isValidSlug(meta.slug)) {
      throw createPathMappingError('ILLEGAL_SLUG', 'Page slug is not a legal Hexo route');
    }

    return `source/${meta.slug}/index.md`;
  }

  const fileName = meta.fileName ?? path.posix.basename(normalizedSourcePath);

  if (!isValidTargetFileName(fileName)) {
    throw createPathMappingError('ILLEGAL_TARGET_FILENAME', 'Post target filename is invalid');
  }

  return `source/_posts/${fileName}`;
}

module.exports = { mapTargetPath };
