/**
 * 杂项共享函数
 */

/**
 * 获取 1 到 1,000,000,000,000 的随机数
 * @reutns {number}
 */
export function getRandomInt(): number {
  return Math.floor(Math.random() * 1_000_000_000_000);
}

/**
 * 等待时间执行
 */
export function sleep(milliseconds: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, milliseconds);
  });
}
