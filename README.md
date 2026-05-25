# 心动拼豆手账

《心动拼豆手账》是一款以图片生成拼豆关卡、颜色归位拼豆为核心玩法的休闲解谜 H5 Demo。

## 当前内容

- 玩家入口：`src/player.html`，只保留关卡入口与试玩游戏，面向对外分享。
- 开发者入口：`src/index.html`，保留关卡生成器，用于后续关卡拓展。
- 关卡入口页：展示游戏标题、当前关卡预览和关卡进入按钮。
- 关卡生成器：导入图片，调整尺寸、缩放、位置和色彩参数，生成拼豆底图。
- 试玩游戏：将打乱的拼豆移入暂存格，再放回正确底色位置完成贴纸复原。
- 固定关卡：第 1/2/3 关分别使用 `src/assets/level-1.png`、`src/assets/level-2.png`、`src/assets/level-3.png`。

## 目录结构

- `docs/`：PRD、Demo 计划、底图识别方案等产品文档。
- `assets/design/`：设计素材、参考图和效果图。
- `assets/bug/`：测试报错截图。
- `assets/reference/`：参考图、灵感收集。
- `notes/`：开发中踩过的坑、Bug 原因和技术方案记录。
- `src/`：可运行的 H5 Demo 代码与运行时资源。

## 本地运行

直接打开：

```text
src/index.html
```

或启动本地静态服务器：

```bash
node src/dev-server.js
```

然后访问：

```text
http://127.0.0.1:4173/
```

## 发布

项目已配置 GitHub Pages workflow。推送到 GitHub 后，Actions 会将 `src/` 目录发布为可试玩网站。

对外玩家链接使用：

```text
https://1659290676-jpg.github.io/xindong-pindou-shouzhang/player.html
```

开发者页面使用：

```text
https://1659290676-jpg.github.io/xindong-pindou-shouzhang/
```
