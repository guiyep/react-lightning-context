import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import external from 'rollup-plugin-peer-deps-external';
import resolve from 'rollup-plugin-node-resolve';
import replace from 'rollup-plugin-replace';
import gzipPlugin from 'rollup-plugin-gzip';
import cleaner from 'rollup-plugin-cleaner';
import json from 'rollup-plugin-json';
import { terser } from 'rollup-plugin-terser';

import pkg from './package.json';

const isProd = process.env.NODE_ENV === 'production';

export default {
  input: 'src/index.js',
  output: [
    {
      file: pkg.main,
      format: 'cjs',
      sourcemap: !isProd,
      compact: true,
      exports: 'named',
    },
  ],
  plugins: [
    external(),
    babel({
      exclude: 'node_modules/**',
      runtimeHelpers: true,
    }),
    resolve({
      extensions: ['.mjs', '.js', '.jsx', '.json'],
    }),
    commonjs(),
    replace({
      ENV: JSON.stringify(process.env.NODE_ENV || 'development'),
    }),
    json(),
    !isProd && gzipPlugin(),
    isProd &&
      cleaner({
        targets: ['./dist/'],
      }),
    isProd &&
      terser({
        toplevel: true,
      }),
  ],
};
