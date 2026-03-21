const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

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

function createReorganizeError(code, message) {
  const error = new Error(message);
  error.code = code;
  return error;
}

function createReorganizePlan(topLevelEntries) {
  return BLOG_DIRECTORY_WHITELIST.filter((directoryName) => topLevelEntries.includes(directoryName)).map(
    (directoryName) => ({
      source: directoryName,
      target: `content/${directoryName}`
    })
  );
}

function assertNoTargetConflicts(plan, existingPaths) {
  for (const step of plan) {
    if (existingPaths.has(step.target)) {
      throw createReorganizeError('TARGET_EXISTS', `Target directory already exists: ${step.target}`);
    }
  }
}

function assertContentRootAvailable(rootDir) {
  const contentPath = path.join(rootDir, 'content');

  if (fs.existsSync(contentPath) && !fs.statSync(contentPath).isDirectory()) {
    throw createReorganizeError('CONTENT_ROOT_UNAVAILABLE', 'Root content path is unavailable: content');
  }
}

function listTopLevelDirectories(rootDir) {
  return fs
    .readdirSync(rootDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name);
}

function collectExistingTargets(rootDir, plan) {
  return new Set(
    plan
      .map((step) => step.target)
      .filter((relativePath) => fs.existsSync(path.join(rootDir, relativePath)))
  );
}

function formatGitMvPlan(plan) {
  return plan.map((step) => `git mv "${step.source}" "${step.target}"`).join('\n');
}

function runGitMvPlan(rootDir, plan) {
  for (const step of plan) {
    const result = spawnSync('git', ['mv', step.source, step.target], {
      cwd: rootDir,
      encoding: 'utf8'
    });

    if (result.status !== 0) {
      throw createReorganizeError(
        'GIT_MV_FAILED',
        result.stderr || result.stdout || `git mv failed for ${step.source}`
      );
    }
  }
}

function reorganizeContent(rootDir) {
  assertContentRootAvailable(rootDir);

  const plan = createReorganizePlan(listTopLevelDirectories(rootDir));
  const existingTargets = collectExistingTargets(rootDir, plan);

  assertNoTargetConflicts(plan, existingTargets);

  if (!fs.existsSync(path.join(rootDir, 'content'))) {
    fs.mkdirSync(path.join(rootDir, 'content'));
  }

  return plan;
}

function main() {
  try {
    const rootDir = process.cwd();
    const plan = reorganizeContent(rootDir);
    const output = formatGitMvPlan(plan);

    if (output) {
      process.stdout.write(`${output}\n`);
      runGitMvPlan(rootDir, plan);
    }
  } catch (error) {
    process.stderr.write(`${error.message}\n`);
    process.exitCode = 1;
  }
}

if (require.main === module) {
  main();
}

module.exports = {
  BLOG_DIRECTORY_WHITELIST,
  assertContentRootAvailable,
  assertNoTargetConflicts,
  createReorganizePlan,
  formatGitMvPlan,
  reorganizeContent,
  runGitMvPlan
};
