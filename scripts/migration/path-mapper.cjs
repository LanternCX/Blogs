function mapTargetPath(_sourcePath, meta) {
  if (meta.kind === 'page') {
    return `source/${meta.slug}/index.md`;
  }

  return `source/_posts/${meta.fileName}`;
}

module.exports = { mapTargetPath };
