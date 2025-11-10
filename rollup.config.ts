import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from 'rollup-plugin-typescript2';
import json from '@rollup/plugin-json';
import terser from '@rollup/plugin-terser';
import copy from 'rollup-plugin-copy';

export default {
  input: './src/index.ts',
  output: {
    dir: './dist',
    format: 'cjs',
    sourcemap: false,
    preserveModules: true,
  },
  plugins: [
    resolve({
      preferBuiltins: true,
    }),
    // 将 CommonJS 模块转换为 ES6
    commonjs({
      requireReturnsDefault: 'preferred',
      defaultIsModuleExports: true,
    }),
    typescript(
      {
        tsconfig: './tsconfig.json',
        tsconfigOverride: {
          compilerOptions: {
            target: 'ES2020',
            module: 'ESNext',
            moduleResolution: 'Node',
          },
        },
        clean: true,
      }),
    // 处理 JSON 文件导入
    json(),
    // 压缩代码
    terser({
      // 混淆变量名
      mangle: true,
      format: {
        // 移除注释
        comments: false,
      },

    }),
    // 复制文件
    copy({
      hook: 'writeBundle',
      copyOnce: false,
      verbose: true,
      targets: [
        { src: 'src/env/**/*', dest: 'dist/env' },
        { src: 'LICENSE', dest: 'dist' },
      ],
    }),
  ],
};
