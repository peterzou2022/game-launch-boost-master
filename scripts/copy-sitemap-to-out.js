#!/usr/bin/env node
/**
 * 将 next-sitemap 在 public/ 中生成的 sitemap 和 robots 复制到 out/
 * 用于 Next.js output: "export"：next build 先复制 public/ 到 out/，postbuild 再更新 public/，
 * 因此需在 postbuild 后手动将新文件复制到 out/，确保部署时包含最新 sitemap。
 */
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const publicDir = path.join(root, 'public');
const outDir = path.join(root, 'out');

if (!fs.existsSync(outDir)) {
  console.log('[copy-sitemap] out/ 不存在，跳过复制');
  process.exit(0);
}

const sitemapFiles = fs.existsSync(publicDir) ? fs.readdirSync(publicDir).filter((f) => f.startsWith('sitemap') && f.endsWith('.xml')) : [];
const files = ['robots.txt', ...sitemapFiles];

files.forEach((file) => {
  const src = path.join(publicDir, file);
  const dest = path.join(outDir, file);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest);
    console.log(`[copy-sitemap] 已复制 ${file} → out/`);
  }
});
