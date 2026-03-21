const fs = require('node:fs');
const path = require('node:path');
const childProcess = require('node:child_process');

const { BLOG_DIRECTORY_WHITELIST } = require('./content-rules.cjs');

const OUTPUT_PATH = path.join('.migration', 'git-meta.json');

function buildGitMetaCommand(relativePath) {
  return `git log --format=%aI -- "${relativePath}"`;
}

function normalizeGitMetaDates(lines) {
  if (!Array.isArray(lines) || lines.length === 0) {
    return null;
  }

  return {
    date: lines.at(-1),
    updated: lines[0]
  };
}

function listMarkdownFiles(rootDir, relativeDir) {
  const directoryPath = path.join(rootDir, relativeDir);

  if (!fs.existsSync(directoryPath) || !fs.statSync(directoryPath).isDirectory()) {
    return [];
  }

  const entries = fs.readdirSync(directoryPath, { withFileTypes: true });
  const results = [];

  for (const entry of entries) {
    const relativePath = path.join(relativeDir, entry.name);
    if (entry.isDirectory()) {
      results.push(...listMarkdownFiles(rootDir, relativePath));
      continue;
    }

    if (entry.isFile() && entry.name.endsWith('.md')) {
      results.push(relativePath.replaceAll(path.sep, '/'));
    }
  }

  return results;
}

function collectGitMeta({ rootDir, execCommand = defaultExecCommand }) {
  const result = {};

  for (const relativeDir of BLOG_DIRECTORY_WHITELIST) {
    for (const relativePath of listMarkdownFiles(rootDir, relativeDir)) {
      const command = buildGitMetaCommand(relativePath);
      const output = execCommand(command);
      const normalized = normalizeGitMetaDates(splitGitOutput(output));

      if (normalized) {
        result[relativePath] = normalized;
      }
    }
  }

  return result;
}

function splitGitOutput(output) {
  return String(output)
    .split(/\r?\n/u)
    .map((line) => line.trim())
    .filter(Boolean);
}

function defaultExecCommand(command) {
  return childProcess.execSync(command, {
    cwd: process.cwd(),
    encoding: 'utf8'
  });
}

function writeGitMetaFile(rootDir, gitMeta) {
  const outputPath = path.join(rootDir, OUTPUT_PATH);
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, `${JSON.stringify(gitMeta, null, 2)}\n`);
}

module.exports = {
  OUTPUT_PATH,
  buildGitMetaCommand,
  collectGitMeta,
  normalizeGitMetaDates,
  splitGitOutput,
  writeGitMetaFile
};

if (require.main === module) {
  const rootDir = process.cwd();
  const gitMeta = collectGitMeta({ rootDir });
  writeGitMetaFile(rootDir, gitMeta);
}
