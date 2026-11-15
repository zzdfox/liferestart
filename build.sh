#!/bin/sh
# 把 src/ 下的文件打包成单个网页：
#   index.html          独立网站（可直接部署到 GitHub Pages / Netlify / Vercel）
#   dist/artifact.html  发布到 claude.ai Artifact 用（不含 <html><head> 骨架）
set -e
cd "$(dirname "$0")"
JS="src/1-talents.js src/1b-surprise.js src/2-events-young.js src/3-events-adult.js src/4-events-late.js src/4b-events-world.js src/4c-events-special.js src/5-engine.js src/5b-ach.js src/6-ui.js"
mkdir -p dist
cat $JS > dist/game.js
node --check dist/game.js
HEAD_END=$(grep -n '^</style>' src/0-head.html | cut -d: -f1)
{
  echo '<!doctype html>'
  echo '<html lang="zh-CN">'
  echo '<head>'
  echo '<meta charset="utf-8">'
  echo '<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">'
  echo '<meta name="description" content="人生重开模拟器：抽天赋、分属性，随机体验一段人生。">'
  head -n "$HEAD_END" src/0-head.html
  echo '</head>'
  echo '<body>'
  tail -n +"$((HEAD_END + 1))" src/0-head.html
  echo '<script>'; cat dist/game.js; echo '</script>'
  echo '</body>'
  echo '</html>'
} > index.html
{ cat src/0-head.html; echo '<script>'; cat dist/game.js; echo '</script>'; } > dist/artifact.html
rm dist/game.js
echo "built index.html ($(wc -c < index.html) bytes) and dist/artifact.html"
