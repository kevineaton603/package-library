const { build } = require('esbuild');

// Automatically exclude all node_modules from the bundled version
const { nodeExternalsPlugin } = require('esbuild-node-externals');

const shared = {
  entryPoints: ['./src/index.ts'],
  bundle: true,
  minify: true,
  platform: 'node',
  sourcemap: true,
  target: 'node14',
  plugins: [nodeExternalsPlugin()]
}

build({
  ...shared,
  outfile: 'dist/zustand-slice-factory.js',
  format: 'cjs'
})

build({
  ...shared,
  outfile: 'dist/zustand-slice-factory.esm.js',
  format: 'esm'
})
