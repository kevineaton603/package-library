const { build } = require('esbuild');
// Automatically exclude all node_modules from the bundled version
const { nodeExternalsPlugin } = require('esbuild-node-externals');
const { dtsPlugin } = require('esbuild-plugin-d.ts');

const shared = {
  entryPoints: ['./src/index.ts'],
  bundle: true,
  minify: true,
  platform: 'node',
  sourcemap: true,
  target: 'node14',
  plugins: [
    nodeExternalsPlugin(),
    dtsPlugin(),
  ],
}

build({
  ...shared,
  outfile: 'dist/zustand-slice-factory.cjs.production.min.js',
  format: 'cjs',
})

build({
  ...shared,
  outfile: 'dist/zustand-slice-factory.esm.js',
  format: 'esm',
})
