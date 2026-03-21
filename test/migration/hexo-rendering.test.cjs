const test = require('node:test');
const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');
const { existsSync, readFileSync, readdirSync } = require('node:fs');

const REPORT_PATH = 'docs/migration/hexo-full-migration-report.md';

function parseMigrationReport() {
  const markdown = readFileSync(REPORT_PATH, 'utf8');
  const summary = {
    success: Number(markdown.match(/成功迁移数量:\s*(\d+)/)?.[1] ?? -1),
    degraded: Number(markdown.match(/降级迁移数量:\s*(\d+)/)?.[1] ?? -1)
  };
  const successRecords = [];
  const degradedRecords = [];
  let section = null;

  for (const line of markdown.split('\n')) {
    if (line === '## 成功迁移') {
      section = 'success';
      continue;
    }

    if (line === '## 降级迁移') {
      section = 'degraded';
      continue;
    }

    if (line.startsWith('## ')) {
      section = null;
      continue;
    }

    if (!['success', 'degraded'].includes(section) || !line.startsWith('| `content/')) {
      continue;
    }

    const cells = line.split('|').slice(1, -1).map((cell) => cell.trim().replace(/^`|`$/g, ''));
    const record = section === 'success'
      ? {
          sourcePath: cells[0],
          targetPath: cells[1],
          kind: cells[2],
          slug: cells[3],
          status: cells[4]
        }
      : {
          sourcePath: cells[0],
          targetPath: cells[1],
          kind: 'post',
          slug: cells[0].split('/')[1],
          status: 'degraded'
        };

    if (section === 'success') {
      successRecords.push(record);
    } else {
      degradedRecords.push(record);
    }
  }

  return {
    summary,
    successRecords,
    degradedRecords,
    writtenRecords: [...successRecords, ...degradedRecords]
  };
}

function normalizeCategorySlug(slug) {
  return slug.replace(/\s+/g, '-');
}

function findGeneratedPostPath(basename, directory = 'public') {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const entryPath = `${directory}/${entry.name}`;

    if (entry.isDirectory()) {
      if (entry.name === basename && existsSync(`${entryPath}/index.html`)) {
        return `${entryPath}/index.html`;
      }

      const nested = findGeneratedPostPath(basename, entryPath);
      if (nested) {
        return nested;
      }
    }
  }

  return null;
}

function resolvePublicPath(record) {
  if (record.kind === 'page') {
    return record.targetPath
      .replace(/^source\//, 'public/')
      .replace(/\/index\.md$/, '/index.html');
  }

  const basename = record.targetPath.replace(/^source\/_posts\//, '').replace(/\.md$/, '');
  const source = readFileSync(record.targetPath, 'utf8');
  const dateMatch = source.match(/^date:\s*"?(\d{4})-(\d{2})-(\d{2})/m);

  if (dateMatch) {
    return `public/${dateMatch[1]}/${dateMatch[2]}/${dateMatch[3]}/${basename}/index.html`;
  }

  const generatedPath = findGeneratedPostPath(basename);
  assert.ok(generatedPath, `missing generated page for ${record.targetPath}`);
  return generatedPath;
}

test('hexo generate renders pages without raw EJS template markers', () => {
  const migrate = spawnSync('npm', ['run', 'migrate:all'], {
    cwd: process.cwd(),
    encoding: 'utf8'
  });

  assert.equal(migrate.status, 0, migrate.stderr || migrate.stdout);
  assert.match(migrate.stdout, /Migrated 39 files and wrote docs\/migration\/hexo-full-migration-report\.md/);

  const clean = spawnSync('npm', ['run', 'hexo:clean'], {
    cwd: process.cwd(),
    encoding: 'utf8'
  });

  assert.equal(clean.status, 0, clean.stderr || clean.stdout);

  const generate = spawnSync('npm', ['run', 'hexo:generate'], {
    cwd: process.cwd(),
    encoding: 'utf8'
  });
  const report = parseMigrationReport();
  const expectedCategorySlugs = [...new Set(report.writtenRecords
    .filter((record) => record.kind === 'post')
    .map((record) => normalizeCategorySlug(record.slug)))].sort();
  const actualCategorySlugs = readdirSync('public/categories', { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();

  assert.equal(generate.status, 0, generate.stderr || generate.stdout);
  assert.equal(report.successRecords.length, report.summary.success, 'success count should match report summary');
  assert.equal(report.degradedRecords.length, report.summary.degraded, 'degraded count should match report summary');
  assert.deepEqual(actualCategorySlugs, expectedCategorySlugs, 'generated category set should match report categories');

  for (const record of report.writtenRecords) {
    assert.equal(existsSync(record.targetPath), true, record.targetPath);
    assert.equal(existsSync(resolvePublicPath(record)), true, resolvePublicPath(record));
  }

  const files = [
    {
      path: 'public/index.html',
      signals: [
        '<title>Caoxin Blog</title>',
        '/2026/03/22/Vibecoding/',
        '/2026/03/19/New%20Project%20Prompt/',
        '/2026/03/19/Paper%20Prompt/'
      ]
    },
    {
      path: 'public/about/index.html',
      signals: ['关于这个小站', '欢迎你来到我的小站']
    },
    {
      path: 'public/friends/index.html',
      signals: ['友链互换 Link Exchange', '欢迎你的来访']
    },
    {
      path: 'public/categories/index.html',
      signals: [
        'Categories',
        'content="Categories Agent ACM-ICPC Debug-Lab EDC Note Other Robotic Smart Car"',
        '/categories/ACM-ICPC/',
        '/categories/Agent/',
        '/categories/Debug-Lab/',
        '/categories/EDC/',
        '/categories/Note/',
        '/categories/Other/',
        '/categories/Robotic/',
        '/categories/Smart-Car/'
      ],
      forbiddenSignals: ['/categories/Smart%20Car/']
    },
    {
      path: 'public/archives/index.html',
      signals: ['归档 | Caoxin Blog', '/2026/03/22/Vibecoding/', '/2026/03/19/New%20Project%20Prompt/']
    },
    {
      path: 'public/2026/01/11/OOP/index.html',
      signals: ['OOP', '基本语法']
    },
    {
      path: 'public/2025/12/05/HZCU 2025 Freshman STL/index.html',
      signals: ['HZCU 2025 Freshman STL', 'STL 的全称']
    },
    {
      path: 'public/2026/01/06/Chapter01-Intro/index.html',
      signals: ['Debug 2025 Freshman - C Programing', '开始之前']
    }
  ];

  for (const { path, signals, forbiddenSignals = [] } of files) {
    const html = readFileSync(path, 'utf8');
    assert.doesNotMatch(html, /<%[-_=]?\s*partial\(/, path);
    assert.doesNotMatch(html, /<%[-_=]?\s*body\s*%>/, path);
    assert.doesNotMatch(html, /<%[^>]*%>/, path);

    for (const signal of signals) {
      assert.match(html, new RegExp(signal.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')), path);
    }

    for (const signal of forbiddenSignals) {
      assert.doesNotMatch(html, new RegExp(signal.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')), path);
    }
  }

  assert.equal(existsSync('public/css/style.css'), true, 'public/css/style.css');
  const css = readFileSync('public/css/style.css', 'utf8');
  assert.match(css, /#header|article|body/, 'public/css/style.css');
});
