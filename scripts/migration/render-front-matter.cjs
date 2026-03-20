const yaml = require('js-yaml');

function renderFrontMatterDocument({ frontMatter, body }) {
  const frontMatterYaml = yaml
    .dump(frontMatter, {
      forceQuotes: true,
      lineWidth: -1,
      noRefs: true,
      quotingType: '"'
    })
    .trimEnd();

  return `---\n${frontMatterYaml}\n---\n\n${body.trimStart()}`;
}

module.exports = { renderFrontMatterDocument };
