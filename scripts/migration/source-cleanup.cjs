const fs = require('node:fs');
const path = require('node:path');

const POSTS_DIRECTORY = 'source/_posts';
const PAGES_MANIFEST_PATH = '.migration/pages-manifest.json';

function fail(message) {
  throw new Error(message);
}

function normalizeManifestPath(entry) {
  if (typeof entry !== 'string') {
    fail('Pages manifest paths must be strings');
  }

  if (entry.includes('\\')) {
    fail('Pages manifest paths must be normalized');
  }

  const segments = entry.split('/');
  if (segments.some((segment) => segment === '' || segment === '.' || segment === '..')) {
    fail('Pages manifest paths must be normalized');
  }

  if (entry === 'source' || !entry.startsWith('source/')) {
    fail('Pages manifest paths must stay under source');
  }

  if (entry === POSTS_DIRECTORY || entry.startsWith(`${POSTS_DIRECTORY}/`)) {
    fail('Pages manifest paths must point to page directories');
  }

  return entry;
}

function loadPagesManifest(rootDir) {
  const manifestPath = path.join(rootDir, PAGES_MANIFEST_PATH);
  if (!fs.existsSync(manifestPath)) {
    return [];
  }

  let payload;
  try {
    payload = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  } catch (_error) {
    fail('Pages manifest has invalid JSON');
  }

  if (!payload || !Array.isArray(payload.paths)) {
    fail('Pages manifest must include a paths array');
  }

  return payload.paths.map(normalizeManifestPath);
}

function removeDirectory(rootDir, relativePath) {
  const absolutePath = path.join(rootDir, relativePath);
  if (!fs.existsSync(absolutePath)) {
    return false;
  }

  const stat = fs.statSync(absolutePath);
  if (!stat.isDirectory()) {
    fail(`Managed source path is not a directory: ${relativePath}`);
  }

  fs.rmSync(absolutePath, { recursive: true, force: true });
  return true;
}

function cleanupManagedSource({ rootDir }) {
  const removedPaths = [];
  const managedPaths = [POSTS_DIRECTORY, ...loadPagesManifest(rootDir)];

  for (const managedPath of managedPaths) {
    if (removeDirectory(rootDir, managedPath)) {
      removedPaths.push(managedPath);
    }
  }

  return { removedPaths };
}

if (require.main === module) {
  const result = cleanupManagedSource({ rootDir: process.cwd() });
  for (const removedPath of result.removedPaths) {
    process.stdout.write(`Removed ${removedPath}\n`);
  }
}

module.exports = {
  POSTS_DIRECTORY,
  PAGES_MANIFEST_PATH,
  cleanupManagedSource,
  loadPagesManifest
};
