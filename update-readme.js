import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 取得 package.json 的 version
const packageJsonPath = path.resolve(__dirname, 'package.json');
const { version } = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));

// 讀取 README.md
const readmePath = path.resolve(__dirname, 'README.md');
let readmeContent = fs.readFileSync(readmePath, 'utf-8');

// 更改版本號
const versionPattern = /Current UI version: \d+\.\d+\.\S+/;
const newVersionString = `Current UI version: ${version}`;
if (versionPattern.test(readmeContent)) {
    readmeContent = readmeContent.replace(versionPattern, newVersionString);
    console.log(`README.md 的版本已更新為: ${version}`);
} else {
    console.error('未找到匹配的版本字符, 更新失敗');
}

// 写回更新后的 README.md
fs.writeFileSync(readmePath, readmeContent, 'utf-8');