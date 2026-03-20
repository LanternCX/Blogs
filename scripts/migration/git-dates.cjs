function buildGitDateCommand(relativePath) {
  return `git log --format=%aI -- "${relativePath}"`;
}

function normalizeGitDates({ lines }) {
  if (!Array.isArray(lines) || lines.length === 0) {
    throw new Error('Missing git author dates');
  }

  return {
    date: lines.at(-1),
    updated: lines[0]
  };
}

module.exports = {
  buildGitDateCommand,
  normalizeGitDates
};
