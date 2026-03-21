const MANUAL_APPENDIX_HEADING = '## 手工附录';

function extractManualAppendix(existingDocument) {
  if (!existingDocument) {
    return '';
  }

  const startIndex = existingDocument.indexOf(MANUAL_APPENDIX_HEADING);

  if (startIndex === -1) {
    return '';
  }

  return existingDocument.slice(startIndex).trimEnd();
}

module.exports = {
  MANUAL_APPENDIX_HEADING,
  extractManualAppendix
};
