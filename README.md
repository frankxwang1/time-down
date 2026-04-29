# Chrono Focus 🕒

Chrono Focus 是一个基于 Electron 开发的赛博朋克风格桌面倒计时插件。它旨在提供一个美观、实用且不干扰工作的专注工具，帮助你更好地管理时间。

![预览图](https://i.mji.rip/2026/04/29/b6391442751af53cf59ffb760450d7c7.png) *(注：截图)*

## ✨ 核心特性

- **赛博朋克美学**：采用霓虹渐变、扫描线效果和 Orbitron 字体，营造独特的科技感。
- **透明悬浮窗**：无边框设计，支持背景透明，完美融入你的桌面环境。
- **置顶模式**：支持一键切换“窗口置顶”，确保倒计时始终在视线范围内。
- **环形进度条**：直观的环形进度显示，带有动态发光效果和倒计时预警（最后 60 秒变为粉色警示）。
- **灵活设置**：可自定义设置时、分、秒，满足不同场景的专注需求。
- **交互便捷**：支持拖拽移动，提供开始/暂停、重置、设置及关闭等完整控制功能。

## 🚀 快速开始

### 环境要求

- [Node.js](https://nodejs.org/) (建议使用 LTS 版本)
- npm (通常随 Node.js 一起安装)

### 安装与运行

1. **克隆仓库** (或下载源代码):
   ```bash
   git clone <repository-url>
   cd test-project
   ```

2. **安装依赖**:
   ```bash
   npm install
   ```

3. **启动应用**:
   ```bash
   npm start
   ```

### 构建与发布

- **本地打包 (macOS)**:
  ```bash
  npm run build
  ```
  打包后的安装包将生成在 `dist` 目录下。

- **自动构建 (CI/CD)**:
  项目配置了 GitHub Actions。每当代码被 `push` 到 `main` 或 `master` 分支时，工作流会自动在 macOS 环境下运行构建，并将生成的 `.dmg` 安装包作为 Artifacts 上传。您可以在 GitHub 仓库的 **Actions** 标签页中找到并下载这些产物。

## 🛠️ 技术栈

- **框架**: [Electron](https://www.electronjs.org/)
- **前端**: HTML5, CSS3 (Flexbox, SVG Animations, CSS Variables), Vanilla JavaScript
- **字体**: Orbitron, Share Tech Mono (通过 Google Fonts 加载)
- **进程通信**: IPC (Inter-Process Communication)

## 📂 项目结构

- `main.js`: Electron 主进程逻辑，处理窗口创建及系统级交互。
- `preload.js`: 预加载脚本，安全地暴露必要接口给渲染进程。
- `renderer.js`: 渲染进程逻辑，包含计时器核心逻辑及 UI 更新。
- `index.html`: 应用主界面结构。
- `styles.css`: 赛博朋克风格的样式实现。

## 📝 使用说明

1. **拖拽**: 点击顶部标题栏区域可拖动窗口。
2. **置顶**: 点击右上角的“大头针”图标可切换窗口置顶状态。
3. **设置**: 点击底部的“齿轮”图标打开设置面板，输入时间后点击 "APPLY" 生效。
4. **计时**: 点击中间的“播放”按钮开始或暂停倒计时。
5. **重置**: 点击左下角的“重置”按钮恢复初始设置。

---

希望 Chrono Focus 能帮助你进入心流状态！如果你喜欢这个项目，欢迎点个 Star 🌟。
