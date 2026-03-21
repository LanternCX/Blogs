const fs = require('node:fs');
const path = require('node:path');

const BLOG_DIRECTORY_WHITELIST = [
  'ACM-ICPC',
  'Agent',
  'Debug-Lab',
  'EDC',
  'Note',
  'Other',
  'Photography',
  'Robotic',
  'Smart Car',
  'Pages'
];

const BLOG_DIRECTORY_SET = new Set(BLOG_DIRECTORY_WHITELIST);
const README_WHITELIST_PATH = path.join('.migration', 'include-readmes.json');

function fail(message) {
  throw new Error(message);
}

function parseWhitelistPath(rawPath) {
  if (typeof rawPath !== 'string') {
    fail('README whitelist paths must be strings');
  }

  if (rawPath.includes('\\')) {
    fail('README whitelist paths must be normalized');
  }

  const segments = rawPath.split('/');
  if (segments.some((segment) => segment === '.' || segment === '..' || segment === '')) {
    fail('README whitelist paths must be normalized');
  }

  if (segments.length < 3 || segments[0] !== 'content') {
    fail('README whitelist paths must stay under content/<dir>');
  }

  if (!BLOG_DIRECTORY_SET.has(segments[1])) {
    fail('README whitelist paths must stay under the blog directory whitelist');
  }

  if (segments[segments.length - 1] !== 'README.md') {
    fail('README whitelist paths must point to README.md');
  }

  return rawPath;
}

function loadIncludeReadmes(rootDir) {
  const filePath = path.join(rootDir, README_WHITELIST_PATH);
  if (!fs.existsSync(filePath)) {
    return new Set();
  }

  let payload;
  try {
    payload = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (_error) {
    fail('README whitelist has invalid JSON');
  }

  if (!payload || !Object.prototype.hasOwnProperty.call(payload, 'paths')) {
    fail('README whitelist must include a paths field');
  }

  if (!Array.isArray(payload.paths)) {
    fail('README whitelist paths must be an array');
  }

  const entries = new Set();
  for (const entry of payload.paths) {
    const normalizedPath = parseWhitelistPath(entry);
    if (entries.has(normalizedPath)) {
      fail('README whitelist contains duplicate paths');
    }

    const absolutePath = path.join(rootDir, normalizedPath);
    if (!fs.existsSync(absolutePath) || !fs.statSync(absolutePath).isFile()) {
      fail('README whitelist paths must point to an existing file');
    }

    entries.add(normalizedPath);
  }

  return entries;
}

function classifyCandidate(relativePath, includeReadmes) {
  const normalizedPath = relativePath.replaceAll('\\', '/');
  const segments = normalizedPath.split('/');

  if (segments.length < 3 || segments[0] !== 'content' || !BLOG_DIRECTORY_SET.has(segments[1])) {
    return { include: false };
  }

  const fileName = segments[segments.length - 1];
  if (!fileName.endsWith('.md') || fileName.endsWith('.marp.md')) {
    return { include: false };
  }

  if (normalizedPath === 'content/Pages/README.md') {
    return { include: false };
  }

  if (fileName === 'README.md') {
    return includeReadmes.has(normalizedPath)
      ? { include: true, kind: 'post' }
      : { include: false };
  }

  if (segments[1] === 'Pages' && segments.length === 3) {
    return { include: true, kind: 'page' };
  }

  return { include: true, kind: 'post' };
}

function createContentRules({ rootDir }) {
  const includeReadmes = loadIncludeReadmes(rootDir);

  return {
    directories: [...BLOG_DIRECTORY_WHITELIST],
    includeReadmes,
    classify(relativePath) {
      return classifyCandidate(relativePath, includeReadmes);
    }
  };
}

module.exports = {
  BLOG_DIRECTORY_WHITELIST,
  createContentRules
};
