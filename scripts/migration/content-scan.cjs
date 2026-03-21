const fs = require('node:fs');
const path = require('node:path');

const { createContentRules } = require('./content-rules.cjs');

const REPO_ROOT = path.resolve(__dirname, '..', '..');

function walkDirectory(directoryPath) {
  const entries = fs.readdirSync(directoryPath, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const entryPath = path.join(directoryPath, entry.name);

    if (entry.isDirectory()) {
      files.push(...walkDirectory(entryPath));
      continue;
    }

    if (entry.isFile()) {
      files.push(entryPath);
    }
  }

  return files;
}

function buildCandidateRecord(sourcePath, classification) {
  const normalizedPath = sourcePath.replaceAll('\\', '/');
  const contentRelativePath = normalizedPath.slice('content/'.length);

  return {
    sourcePath: normalizedPath,
    kind: classification.kind,
    category: contentRelativePath.split('/')[0],
    slug: path.posix.basename(contentRelativePath, path.posix.extname(contentRelativePath))
  };
}

function scanContentCandidates({
  rootDir = REPO_ROOT,
  contentRules = createContentRules({ rootDir })
} = {}) {
  const contentDir = path.join(rootDir, 'content');

  if (!fs.existsSync(contentDir)) {
    return [];
  }

  return walkDirectory(contentDir)
    .map((filePath) => path.relative(rootDir, filePath).replaceAll('\\', '/'))
    .map((sourcePath) => ({ sourcePath, classification: contentRules.classify(sourcePath) }))
    .filter(({ classification }) => classification.include)
    .sort((left, right) => left.sourcePath.localeCompare(right.sourcePath))
    .map(({ sourcePath, classification }) => buildCandidateRecord(sourcePath, classification));
}

if (require.main === module) {
  process.stdout.write(`${JSON.stringify(scanContentCandidates(), null, 2)}\n`);
}

module.exports = { scanContentCandidates };
