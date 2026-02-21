import esbuild from 'esbuild';

esbuild.buildSync({
  entryPoints: ['src/index.ts'],
  bundle: true,
  format: 'esm',
  outfile: 'dist/index.js',
  external: [
    'react', 'react-dom', 'react/jsx-runtime',
    'motion', 'motion/react',
    'tailwindcss',
    '@radix-ui/react-slot', 'clsx', 'tailwind-merge',
  ],
  jsx: 'automatic',
  sourcemap: true,
  target: 'es2022',
  loader: { '.ts': 'ts', '.tsx': 'tsx' },
});

console.log('✓ Library bundled to dist/index.js');
