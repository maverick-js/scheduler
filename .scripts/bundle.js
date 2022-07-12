import { build } from 'esbuild';

async function main() {
  await build({
    entryPoints: ['src/index.ts'],
    outfile: `dist/index.js`,
    treeShaking: true,
    format: 'esm',
    bundle: true,
    platform: 'browser',
    target: 'es2019',
    write: true,
    watch: hasArg('-w'),
    minify: true,
  });
}

function hasArg(arg) {
  return process.argv.includes(arg);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
