# 人生重开模拟器

一个纯前端的网页小游戏：抽天赋、分属性、逐年体验一段随机人生。没有后端，也不依赖任何框架，打包后只有一个 `index.html`。

**在线游玩：** https://zzdfox.github.io/liferestart/

## 本地游玩

双击 `index.html` 就能在浏览器里打开。存档（成就、档案、继承的天赋）保存在浏览器的 localStorage 里，同一个浏览器才能读到。

## 修改游戏内容

所有内容都在 `src/` 里，改完运行 `./build.sh` 重新生成 `index.html`。

| 文件 | 内容 |
| --- | --- |
| `src/0-head.html` | 样式和页面骨架 |
| `src/1-talents.js` | 普通到传说品级的天赋 |
| `src/1b-surprise.js` | 惊喜天赋（美籍、王室、投胎成猫……） |
| `src/2-events-young.js` | 0~18 岁事件 |
| `src/3-events-adult.js` | 大学、工作、婚恋事件 |
| `src/4-events-late.js` | 晚年、修仙、奇异结局 |
| `src/4b-events-world.js` | 美籍 / 王室 / 石油王 / 星二代事件，人生抉择 |
| `src/4c-events-special.js` | 动物、重生、主角光环、觉醒、时光机、吸血鬼 |
| `src/5-engine.js` | 人生引擎、评分、抽卡概率（`ODDS`） |
| `src/5b-ach.js` | 成就 |
| `src/6-ui.js` | 界面和交互 |

事件写法见 `src/2-events-young.js` 顶部的注释。想调惊喜天赋的出现率，改 `src/5-engine.js` 里的 `ODDS`（顺序是普通、稀有、史诗、传说、惊喜）。

## 部署成公开网站

任选一种，部署的都只是 `index.html` 这一个文件。

- **Netlify Drop（最快）**：打开 https://app.netlify.com/drop ，把整个 `liferestart` 文件夹拖进去，几秒后得到一个公开网址。注册免费账号后网址会一直保留。
- **GitHub Pages（免费、长期）**：新建一个公开仓库，上传 `index.html`，在仓库 Settings → Pages 里选择从 `main` 分支部署，网址是 `https://<用户名>.github.io/<仓库名>/`。
- **Vercel**：在本目录运行 `npx vercel`，按提示登录即可。
