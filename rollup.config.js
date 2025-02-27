import typescript from '@rollup/plugin-typescript';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { terser } from 'rollup-plugin-terser';
import json from '@rollup/plugin-json';
import del from 'rollup-plugin-delete';
import filesize from 'rollup-plugin-filesize';
import { visualizer } from 'rollup-plugin-visualizer';
import analyzer from 'rollup-plugin-analyzer';

export default {
  input: 'src/index.ts',
  output: [
    {
      file: 'dist/index.js',
      format: 'cjs',
      sourcemap: true,
    },
    {
      file: 'dist/index.esm.js',
      format: 'es',
      sourcemap: true,
    }
  ],
  plugins: [
    del({ targets: 'dist/*' }),
    nodeResolve(),
    commonjs(),
    json(),
    typescript({
      tsconfig: './tsconfig.json',
    }),
    terser(),
    filesize({
      showMinifiedSize: true,
      showBrotliSize: true,
      showGzippedSize: true,
    }),
    visualizer({
      filename: 'dist/stats.html',
      title: 'Bundle Visualizer',
      open: true,
      template: 'treemap', // 可选值: treemap, sunburst, network
      gzipSize: true,
      brotliSize: true,
      sourcemap: true
    }),
    analyzer({
      summaryOnly: false,
      limit: 10,
      filter: null,
      filterSummary: true,
      skipFormatted: false
    })
  ],
  external: ['dayjs', 'axios']
};
