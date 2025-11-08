/**
 * 许可证验证测试脚本
 * 用于测试许可证检查功能是否正常工作
 */

import fs from 'fs';
import path from 'path';

const LICENSE_PATH = path.join(__dirname, '../LICENSE');
const BACKUP_PATH = path.join(__dirname, '../LICENSE.backup');

console.log('========================================');
console.log('许可证验证测试');
console.log('========================================\n');

// 测试 1: 检查 LICENSE 文件是否存在
console.log('测试 1: 检查 LICENSE 文件...');
if (fs.existsSync(LICENSE_PATH)) {
  console.log('✓ LICENSE 文件存在');
} else {
  console.log('✗ LICENSE 文件不存在');
}

// 测试 2: 检查 LICENSE 文件内容
console.log('\n测试 2: 检查 LICENSE 文件内容...');
try {
  const content = fs.readFileSync(LICENSE_PATH, 'utf-8');
  
  const hasGPL = content.includes('GNU GENERAL PUBLIC LICENSE') || content.includes('GPL');
  const hasRepo = content.includes('https://github.com/MtSatou/MTE');
  
  if (hasGPL) {
    console.log('✓ 包含 GPL 协议标识');
  } else {
    console.log('✗ 缺少 GPL 协议标识');
  }
  
  if (hasRepo) {
    console.log('✓ 包含项目仓库地址');
  } else {
    console.log('✗ 缺少项目仓库地址');
  }
  
  if (hasGPL && hasRepo) {
    console.log('\n✓ LICENSE 文件验证通过！');
  } else {
    console.log('\n✗ LICENSE 文件验证失败！');
  }
} catch (error) {
  console.log('✗ 无法读取 LICENSE 文件:', error);
}

// 测试 3: 模拟缺少 LICENSE 文件的情况
console.log('\n========================================');
console.log('测试 3: 模拟缺少 LICENSE 文件...');
console.log('========================================');
console.log('此测试将临时移除 LICENSE 文件以测试验证机制');
console.log('按 Ctrl+C 取消，或等待 5 秒后自动继续...\n');

setTimeout(() => {
  if (fs.existsSync(LICENSE_PATH)) {
    // 备份 LICENSE 文件
    fs.copyFileSync(LICENSE_PATH, BACKUP_PATH);
    console.log('✓ 已备份 LICENSE 文件');
    
    // 删除 LICENSE 文件
    fs.unlinkSync(LICENSE_PATH);
    console.log('✓ 已临时移除 LICENSE 文件');
    
    console.log('\n现在尝试启动应用，应该会看到错误提示...');
    console.log('测试完成后，运行以下命令恢复 LICENSE 文件:');
    console.log('  move LICENSE.backup LICENSE\n');
  }
}, 5000);
