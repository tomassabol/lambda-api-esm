'use strict';

/**
 * Build CJS and ESM artifacts from ESM source modules.
 * @author Jeremy Daly <jeremy@jeremydaly.com>
 * @license MIT
 */

const esbuild = require('esbuild');
const fs = require('fs');
const path = require('path');
const cjsFooter = require('./cjs-footer.js');

const root = path.join(__dirname, '..');
const libDir = path.join(root, 'lib');
const esmDir = path.join(root, 'dist', 'esm');
const cjsDir = path.join(root, 'dist', 'cjs');

const entryPoints = [
  path.join(root, 'index.js'),
  ...fs
    .readdirSync(libDir)
    .filter((file) => file.endsWith('.js'))
    .map((file) => path.join(libDir, file)),
];

const sharedOptions = {
  entryPoints,
  platform: 'node',
  target: 'node14',
  bundle: false,
  packages: 'external',
  logLevel: 'info',
};

async function build() {
  fs.rmSync(path.join(root, 'dist'), { recursive: true, force: true });
  fs.mkdirSync(esmDir, { recursive: true });
  fs.mkdirSync(cjsDir, { recursive: true });

  await esbuild.build({
    ...sharedOptions,
    outdir: esmDir,
    format: 'esm',
  });

  await esbuild.build({
    ...sharedOptions,
    outdir: cjsDir,
    format: 'cjs',
    define: {
      'import.meta.url': '__filename',
    },
    supported: {
      'dynamic-import': false,
    },
    footer: { js: cjsFooter },
  });

  fs.writeFileSync(
    path.join(esmDir, 'package.json'),
    JSON.stringify({ type: 'module' }, null, 2) + '\n'
  );

  fs.writeFileSync(
    path.join(cjsDir, 'package.json'),
    JSON.stringify({ type: 'commonjs' }, null, 2) + '\n'
  );
}

build().catch((error) => {
  console.error(error);
  process.exit(1);
});
