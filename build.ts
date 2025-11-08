import fs from 'fs-extra';
import process from 'process';
import logger from 'jet-logger';
import childProcess from 'child_process';
import javascriptObfuscator from 'javascript-obfuscator';

/**
 * Start
 */
(async () => {
  try {
    // Remove current build
    await remove('./dist/');
    // Copy front-end files
    await copy('./src/public', './dist/public');
    // Copy DbJSON files
    await copy('./src/repos/db', './dist/repos/db');
    // Copy back-end files
    await exec('tsc --build tsconfig.prod.json && tsc-alias', './');
    // Obfuscate the JavaScript files in dist folder
    await obfuscate('./dist');
  } catch (err) {
    logger.err(err);
    process.exit(1);
  }
})();

/**
 * Remove file
 */
function remove(loc: string): Promise<void> {
  return new Promise((res, rej) => {
    return fs.remove(loc, (err) => {
      return (!!err ? rej(err) : res());
    });
  });
}

/**
 * Copy file.
 */
function copy(src: string, dest: string): Promise<void> {
  return new Promise((res, rej) => {
    return fs.copy(src, dest, (err) => {
      return (!!err ? rej(err) : res());
    });
  });
}

/**
 * Do command line command.
 */
function exec(cmd: string, loc: string): Promise<void> {
  return new Promise((res, rej) => {
    return childProcess.exec(cmd, { cwd: loc }, (err, stdout, stderr) => {
      if (!!stdout) {
        logger.info(stdout);
      }
      if (!!stderr) {
        logger.warn(stderr);
      }
      return (!!err ? rej(err) : res());
    });
  });
}

/**
 * Obfuscate JavaScript files in the given folder
 */
async function obfuscate(loc: string): Promise<void> {
  const files = await fs.readdir(loc);
  for (const file of files) {
    const filePath = `${loc}/${file}`;
    const stat = await fs.stat(filePath);

    if (stat.isDirectory()) {
      // Recursively obfuscate files in subdirectories
      await obfuscate(filePath);
    } else if (filePath.endsWith('.js') || filePath.endsWith('.ts')) {
      // Read the file, obfuscate it, and overwrite the original file
      const code = await fs.readFile(filePath, 'utf-8');

      // Obfuscate the code with the complex settings
      const obfuscatedCode = javascriptObfuscator.obfuscate(code, {
        compact: true, // 去除空白和注释，减小文件大小
        controlFlowFlattening: true, // 启用控制流扁平化，改变代码执行路径
        controlFlowFlatteningThreshold: 0.5, // 适中强度，避免过度影响程序逻辑
        deadCodeInjection: true, // 启用死代码注入，加入不执行的代码
        deadCodeInjectionThreshold: 0.3, // 适度插入死代码
        debugProtection: false, // 禁用调试保护，避免干扰开发时的调试
        stringArray: true, // 启用字符串数组化
        stringArrayEncoding: ['base64'], // 使用base64编码字符串
        stringArrayThreshold: 0.5, // 适度加密50%的字符串
        rotateStringArray: true, // 旋转字符串数组，使得顺序难以预测
        selfDefending: false, // 禁用自我防卫，避免影响调试和开发
        renameGlobals: true, // 启用全局变量重命名
        identifierNamesGenerator: 'mangled', // 使用混淆的标识符命名
        renameFunction: true, // 启用函数重命名
        target: 'node', // 指定目标环境为Node.js
        transformObjectKeys: true, // 混淆对象的键名
      }).getObfuscatedCode();
      await fs.writeFile(filePath, obfuscatedCode);
      logger.info(`Obfuscated ${filePath}`);
    }
  }
}
