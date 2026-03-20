function extractTitle(markdown) {
  const match = markdown.match(/^(?:\s*[-*+]\s+)?#{1,6}[ \t]+(.+)$/m);

  if (!match) {
    throw new Error('Missing markdown heading');
  }

  const title = match[1].trim();

  if (!title) {
    throw new Error('Missing markdown heading');
  }

  return title;
}

module.exports = { extractTitle };
