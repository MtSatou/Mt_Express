/**
 * Remove old files, copy front-end ones.
 */

import fs from 'fs-extra';
import process from 'process';
import logger from 'jet-logger';
import childProcess from 'child_process';


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
    return childProcess.exec(cmd, {cwd: loc}, (err, stdout, stderr) => {
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
