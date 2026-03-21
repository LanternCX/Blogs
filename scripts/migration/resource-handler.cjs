const fs = require('node:fs');
const path = require('node:path');

const ALLOWED_FRONT_MATTER_FIELDS = new Set(['cover', 'banner', 'thumbnail', 'image']);
const MARKDOWN_LINK_PATTERN = /(!?\[[^\]]*\]\()([^\n)]+)(\))/g;

function normalizePath(value) {
  return value.replaceAll('\\', '/');
}

function normalizeReference(reference) {
  return normalizePath(reference);
}

function isExternalReference(reference) {
  return /^(?:[a-z]+:)?\/\//i.test(reference) || /^(?:mailto:|data:|#)/i.test(reference);
}

function isRootLocalPath(value) {
  return normalizeReference(value).startsWith('/');
}

function looksLikeLocalResourcePath(value) {
  if (typeof value !== 'string') {
    return false;
  }

  const normalizedValue = normalizeReference(value).trim();

  if (!normalizedValue || isExternalReference(normalizedValue)) {
    return false;
  }

  return normalizedValue.startsWith('./') || normalizedValue.startsWith('../');
}

function isWindowsAbsolutePath(value) {
  return /^[a-zA-Z]:[\\/]/.test(value);
}

function isRelativeResourcePath(value) {
  const normalizedValue = normalizeReference(value);
  return normalizedValue.startsWith('./') || normalizedValue.startsWith('../');
}

function ensureDotSlash(relativePath) {
  if (relativePath.startsWith('../')) {
    return relativePath;
  }

  return relativePath.startsWith('./') ? relativePath : `./${relativePath}`;
}

function getPostAssetDirectory(targetPath) {
  return path.posix.join(path.posix.dirname(targetPath), path.posix.basename(targetPath, path.posix.extname(targetPath)));
}

function getAssetRoot(kind, targetPath) {
  return kind === 'post' ? getPostAssetDirectory(targetPath) : path.posix.dirname(targetPath);
}

function buildMigratedReference(kind, targetPath, resourceRelativePath) {
  const assetPath = path.posix.join(getAssetRoot(kind, targetPath), resourceRelativePath);
  return ensureDotSlash(path.posix.relative(path.posix.dirname(targetPath), assetPath));
}

function getTargetResourceSubpath(reference) {
  const normalizedReference = normalizeReference(reference);
  const segments = normalizedReference.split('/').filter((segment) => segment !== '.' && segment !== '..' && segment.length > 0);
  return segments.join('/');
}

function buildSourceResourcePath(sourcePath, reference) {
  return path.posix.normalize(path.posix.join(path.posix.dirname(sourcePath), normalizeReference(reference)));
}

function getAllowedSourceRoot(sourcePath, kind) {
  const normalizedSourcePath = normalizeReference(sourcePath);
  const segments = normalizedSourcePath.split('/');

  if (kind === 'page') {
    return 'content/Pages';
  }

  return segments.slice(0, 2).join('/');
}

function isWithinAllowedSourceRoot(sourcePath, kind, resolvedSourcePath) {
  const allowedRoot = getAllowedSourceRoot(sourcePath, kind);
  return resolvedSourcePath === allowedRoot || resolvedSourcePath.startsWith(`${allowedRoot}/`);
}

function isAlreadyMigratedReference(kind, targetPath, reference) {
  const normalizedReference = normalizeReference(reference);

  if (kind !== 'post') {
    return false;
  }

  const postAssetPrefix = ensureDotSlash(`${path.posix.basename(targetPath, path.posix.extname(targetPath))}/`);
  return normalizedReference.startsWith(postAssetPrefix);
}

function filesMatch(leftPath, rightPath) {
  const left = fs.readFileSync(leftPath);
  const right = fs.readFileSync(rightPath);
  return left.equals(right);
}

function copyResource(rootDir, sourceRelativePath, targetRelativePath) {
  const sourceFilePath = path.join(rootDir, sourceRelativePath);
  const targetFilePath = path.join(rootDir, targetRelativePath);

  if (!fs.existsSync(sourceFilePath)) {
    return {
      ok: false,
      issue: {
        level: 'degraded',
        reason: 'missing_resource',
        source: sourceRelativePath
      }
    };
  }

  fs.mkdirSync(path.dirname(targetFilePath), { recursive: true });

  if (fs.existsSync(targetFilePath)) {
    if (filesMatch(sourceFilePath, targetFilePath)) {
      return { ok: true };
    }

    return {
      ok: false,
      issue: {
        level: 'degraded',
        reason: 'resource_target_conflict',
        target: targetRelativePath
      }
    };
  }

  fs.copyFileSync(sourceFilePath, targetFilePath);
  return { ok: true };
}

function resolveBodyReference({ rootDir, sourcePath, targetPath, kind, reference }) {
  const normalizedReference = normalizeReference(reference);

  if (isExternalReference(normalizedReference)) {
    return { rewritten: reference };
  }

  if (isWindowsAbsolutePath(reference) || isRootLocalPath(normalizedReference) || !isRelativeResourcePath(normalizedReference)) {
    return {
      rewritten: reference,
      issue: {
        level: 'degraded',
        reason: 'non_relative_resource_path',
        value: reference
      }
    };
  }

  if (isAlreadyMigratedReference(kind, targetPath, normalizedReference)) {
    return { rewritten: normalizedReference };
  }

  const targetResourceSubpath = getTargetResourceSubpath(normalizedReference);
  const sourceRelativePath = buildSourceResourcePath(sourcePath, normalizedReference);

  if (!isWithinAllowedSourceRoot(sourcePath, kind, sourceRelativePath)) {
    return {
      rewritten: reference,
      issue: {
        level: 'degraded',
        reason: 'resource_source_out_of_scope',
        source: sourceRelativePath
      }
    };
  }

  const targetRelativePath = path.posix.join(getAssetRoot(kind, targetPath), targetResourceSubpath);
  const copyResult = copyResource(rootDir, sourceRelativePath, targetRelativePath);

  if (!copyResult.ok) {
    return { rewritten: reference, issue: copyResult.issue };
  }

  return {
    rewritten: buildMigratedReference(kind, targetPath, targetResourceSubpath)
  };
}

function rewriteMarkdownReferences(options) {
  const issues = [];
  let inFence = false;
  const markdown = options.markdown
    .split(/(\r?\n)/)
    .map((segment) => {
      const line = segment.replace(/\r?\n$/, '');

      if (line.startsWith('```')) {
        inFence = !inFence;
        return segment;
      }

      if (inFence) {
        return segment;
      }

      return segment.replace(MARKDOWN_LINK_PATTERN, (fullMatch, prefix, reference, suffix) => {
        const result = resolveBodyReference({ ...options, reference });

        if (result.issue) {
          issues.push(result.issue);
        }

        return `${prefix}${result.rewritten}${suffix}`;
      });
    })
    .join('');

  return { markdown, issues };
}

function rewriteFrontMatter(options) {
  const issues = [];
  const frontMatter = {};

  for (const [field, value] of Object.entries(options.frontMatter || {})) {
    if (typeof value !== 'string' || isExternalReference(value)) {
      frontMatter[field] = value;
      continue;
    }

    if (!ALLOWED_FRONT_MATTER_FIELDS.has(field)) {
      frontMatter[field] = value;

      if (looksLikeLocalResourcePath(value)) {
        issues.push({
          level: 'degraded',
          reason: 'unsupported_front_matter_resource_field',
          field
        });
      }

      continue;
    }

    const normalizedValue = normalizeReference(value);

    if (isWindowsAbsolutePath(value) || isRootLocalPath(normalizedValue)) {
      frontMatter[field] = value;
      issues.push({
        level: 'degraded',
        reason: 'non_relative_resource_path',
        field,
        value
      });
      continue;
    }

    if (!isRelativeResourcePath(normalizedValue)) {
      frontMatter[field] = value;
      continue;
    }

    if (isAlreadyMigratedReference(options.kind, options.targetPath, normalizedValue)) {
      frontMatter[field] = normalizedValue;
      continue;
    }

    const targetResourceSubpath = getTargetResourceSubpath(normalizedValue);
    const sourceRelativePath = buildSourceResourcePath(options.sourcePath, normalizedValue);

    if (!isWithinAllowedSourceRoot(options.sourcePath, options.kind, sourceRelativePath)) {
      frontMatter[field] = value;
      issues.push({
        level: 'degraded',
        reason: 'resource_source_out_of_scope',
        field,
        source: sourceRelativePath
      });
      continue;
    }

    const targetRelativePath = path.posix.join(getAssetRoot(options.kind, options.targetPath), targetResourceSubpath);
    const copyResult = copyResource(options.rootDir, sourceRelativePath, targetRelativePath);

    if (!copyResult.ok) {
      frontMatter[field] = value;
      issues.push(copyResult.issue);
      continue;
    }

    frontMatter[field] = buildMigratedReference(options.kind, options.targetPath, targetResourceSubpath);
  }

  return { frontMatter, issues };
}

function summarizeIssues(issues) {
  const manualReviewIssue = issues.find((issue) => issue.level === 'manual_review_unwritten');

  if (manualReviewIssue) {
    return {
      resultKind: 'manual_review_unwritten',
      reason: manualReviewIssue.reason
    };
  }

  const degradedIssue = issues.find((issue) => issue.level === 'degraded');

  if (degradedIssue) {
    return {
      resultKind: 'degraded',
      reason: degradedIssue.reason
    };
  }

  return {
    resultKind: 'success',
    reason: null
  };
}

function handleExplicitResources({ rootDir, sourcePath, targetPath, kind, markdown, frontMatter = {} }) {
  const markdownResult = rewriteMarkdownReferences({ rootDir, sourcePath, targetPath, kind, markdown });
  const frontMatterResult = rewriteFrontMatter({ rootDir, sourcePath, targetPath, kind, frontMatter });
  const issues = [...frontMatterResult.issues, ...markdownResult.issues];
  const summary = summarizeIssues(issues);

  return {
    markdown: markdownResult.markdown,
    frontMatter: frontMatterResult.frontMatter,
    issues,
    resultKind: summary.resultKind,
    reason: summary.reason
  };
}

module.exports = {
  ALLOWED_FRONT_MATTER_FIELDS,
  handleExplicitResources
};
