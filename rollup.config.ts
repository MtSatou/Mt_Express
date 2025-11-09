import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from 'rollup-plugin-typescript2';
import json from '@rollup/plugin-json';

export default {
  input: './src/index.ts',                              // 入口文件
  output: {
    file: './dist/bundle.js',                           // 打包后的输出文件
    format: 'cjs',                                      // 输出格式为 CommonJS
    sourcemap: true,                                    // 启用 sourcemap 调试
  },
  plugins: [
    resolve({
      preferBuiltins: true,                             // 使用内建模块
    }),                                                 // 解析 Node 模块
    commonjs(),                                         // 将 CommonJS 模块转换为 ES6
    typescript({ tsconfig: './tsconfig.json' }),        // 使用 TypeScript 插件
    json(),                                             // 处理 JSON 文件导入
  ],
};
