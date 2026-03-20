const path = require('node:path');

function classifyContent(relativePath) {
  const normalizedPath = relativePath.replaceAll('\\', '/');

  if (normalizedPath.startsWith('Pages/')) {
    return {
      kind: 'page',
      slug: path.basename(normalizedPath, path.extname(normalizedPath)).toLowerCase()
    };
  }

  return { kind: 'post' };
}

module.exports = { classifyContent };
