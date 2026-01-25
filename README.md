# 🎱 Billiard University Scoring System

[![CI](https://github.com/acheraga/billiard-university-app/actions/workflows/ci.yml/badge.svg)](https://github.com/acheraga/billiard-university-app/actions/workflows/ci.yml)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Vue](https://img.shields.io/badge/Vue-3.4-green)
![Copilot Ready](https://img.shields.io/badge/Copilot-Ready-purple)

> CI badge auto-filled from git remote origin: `acheraga/billiard-university-app`.

### https://billiarduniversity.org/testing/exams/

<img src="src/assets/exam1_figs/fig-000.jpg" alt="Overview" width="300">
<img src="src/assets/demo/demo1.png" alt="Overview" width="300">
<img src="src/assets/demo/demo2.png" alt="Overview" width="300">

A Vue 3 + TypeScript application for scoring and tracking Billiard University exams.

## ✨ Recent Updates

- ✅ **TypeScript Migration** - Full TypeScript conversion with type safety
- ✅ **GitHub Copilot Ready** - Optimized for AI-assisted development
- ✅ **Enhanced Documentation** - JSDoc comments on all major functions
- ✅ **Developer Experience** - VS Code settings and extensions configured

## 📚 Documentation

- [MIGRATION_TYPESCRIPT.md](MIGRATION_TYPESCRIPT.md) - TypeScript migration guide
- [COPILOT_SETUP.md](COPILOT_SETUP.md) - GitHub Copilot configuration
- [.github/copilot-instructions.md](.github/copilot-instructions.md) - Project-specific AI instructions

## Quick Start

1. Install dependencies:

```bash
npm install
```

2. Run development server:

```bash
npm run dev
```

3. Open http://localhost:3000
   - http://localhost:5173/billiard-university-app/

## Features

- Complete Exam I & II scoring
- Real-time calculations
- Score history tracking
- Export functionality
- Responsive design

## Project Structure

```
billiard-university-app/
├── src/
│   ├── components/     # Vue components (TypeScript)
│   ├── store/         # Pinia state management
│   ├── types/         # TypeScript type definitions
│   ├── utils/         # Utilities
│   └── assets/        # Styles & images
├── tests/             # Vitest unit tests
├── .vscode/           # VS Code configuration
├── .github/           # GitHub workflows & Copilot instructions
└── index.html         # Entry point
```

## 🤖 AI-Assisted Development

This project is optimized for GitHub Copilot:

- **Custom Instructions**: Project-specific coding patterns in [.github/copilot-instructions.md](.github/copilot-instructions.md)
- **Type Safety**: Full TypeScript support with JSDoc documentation
- **Smart Suggestions**: Context-aware completions for Vue, Pinia, and TypeScript
- **VS Code Integration**: Pre-configured settings for optimal Copilot experience

See [COPILOT_SETUP.md](COPILOT_SETUP.md) for complete setup guide.

## License

MIT

## 🙏 Acknowledgments

- Built with assistance from **DeepSeek AI Assistant**
- Built with assistance from **Copilot AI Assistant**
- Based on the original Billiard University scoring system
- Icons by [Font Awesome](https://fontawesome.com)
- Built with [Vue.js](https://vuejs.org)

---

### 🤖 AI Assistance

This project was developed with the assistance of **DeepSeek AI and Copilot Assistant**, which helped with:

- Vue.js 3 application architecture
- Scoring logic implementation
- Component design and structure
- Deployment configuration for GitHub Pages

_Note: While AI assistance was used in development, all code decisions and implementations were reviewed and adapted for this specific use case._
