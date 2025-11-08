/**
 * 许可证验证模块
 * 检查项目根目录是否存在 LICENSE 文件
 */

import fs from 'fs';
import path from 'path';

/**
 * 验证许可证文件是否存在
 * @throws {Error} 如果许可证文件不存在
 */
export function validateLicense(): void {
  const licensePath = path.join(__dirname, '../../LICENSE');
  
  if (!fs.existsSync(licensePath)) {
    const errorMessage = `
========================================
错误: 缺少运行许可文件！
========================================
本程序需要 LICENSE 文件才能运行。

本项目基于 GNU General Public License v3.0 (GPL-3.0) 开源协议。
项目仓库: https://github.com/MtSatou/MTE

请确保项目根目录包含 LICENSE 文件。
您可以从以下地址获取完整的 LICENSE 文件:
https://github.com/MtSatou/MTE
========================================
`;
    throw new Error(errorMessage);
  }

  // 验证 LICENSE 文件内容是否包含必要信息
  try {
    const licenseContent = fs.readFileSync(licensePath, 'utf-8');
    
    // 检查是否包含 GPL 协议标识
    const hasGPL = licenseContent.includes('GNU GENERAL PUBLIC LICENSE') || 
                   licenseContent.includes('GPL');
    
    // 检查是否包含仓库地址
    const hasRepo = licenseContent.includes('https://github.com/MtSatou/MTE');
    
    if (!hasGPL || !hasRepo) {
      const errorMessage = `
========================================
警告: LICENSE 文件内容不完整！
========================================
LICENSE 文件必须包含:
1. GNU General Public License (GPL) 协议
2. 项目仓库地址: https://github.com/MtSatou/MTE
========================================
`;
      throw new Error(errorMessage);
    }
  } catch (error) {
    if (error instanceof Error && error.message.includes('LICENSE 文件')) {
      throw error;
    }
    throw new Error('错误: 无法读取 LICENSE 文件: ' + String(error));
  }
}

/**
 * 获取许可证信息
 */
export function getLicenseInfo(): string {
  return `
========================================
Mt_Express (MTE)
========================================
许可协议: GNU General Public License v3.0
项目仓库: https://github.com/MtSatou/MTE
作者: MtSatou
========================================
`;
}
