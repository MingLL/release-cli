# AGENTS.md

## 项目范围

本仓库用于实现一个跨平台 CLI，用来创建或初始化发布流程模板。

当前阶段（骨架）：

- 基于 oclif 的最小可运行 CLI
- 现有示例命令为 `hello` / `hello world`
- 现有测试覆盖示例命令与基础构建链路

目标能力（后续逐步建设）：

- 支持 `create`，用于新项目初始化
- 支持 `init`，用于已有仓库接入发布流程
- 同时支持 `GitHub` 和 `GitLab`
- 支持 `Node.js`、`Spring Maven` 和 `Generic` 三类项目模板
- 在 macOS、Linux 和 Windows 上保持一致行为

## 语言规则

面向仓库的沟通与文档默认使用中文。

规则：

- 除非文件场景明确要求，否则项目文档统一使用中文
- 设计说明、实现计划、使用指引统一使用中文
- 新增面向用户的文档时，README、计划文档和生成文档中的术语要保持一致
- 代码标识符和 Conventional Commit 类型可按惯例继续使用英文

## 分支策略

进行任何非文档改动前，必须先创建并切换到独立分支。

规则：

- 不要直接在 `main` 上开发
- 一个分支只承载一个逻辑变更
- 分支名应简短且能说明用途，例如：
  - `feat/cli-prompts`
  - `feat/template-gitlab-node`
  - `fix/windows-path-resolution`
  - `docs/project-governance`
- 纯文档修改如果与当前分支主题直接相关，可以继续留在当前分支

## 提交规范

提交信息使用 Conventional Commits，`type` 和 `scope` 保持小写。

格式：

`<type>(<scope>): <subject>`

示例：

- `feat(cli): add non-interactive command flags`
- `fix(render): handle missing template directories`
- `docs(project): add repository working rules`
- `test(generate): cover gitlab spring scaffold output`

允许的类型：

- `feat`
- `fix`
- `refactor`
- `perf`
- `docs`
- `test`
- `build`
- `ci`
- `chore`
- `style`
- `revert`

推荐的 scope：

- `cli`
- `create`
- `init`
- `prompts`
- `render`
- `generate`
- `git`
- `templates`
- `github`
- `gitlab`
- `node`
- `spring`
- `generic`
- `project`
- `core`

## 仓库结构

- `bin`：CLI 启动脚本（`run` / `dev`）
- `src/index.ts`：当前 CLI 导出入口
- `src/commands/hello`：当前示例命令实现
- `test/commands/hello`：当前示例命令测试
- `dist`：TypeScript 构建产物
- `docs/superpowers/plans`：实现计划文档

目标演进结构（在实现 `create` / `init` 时逐步落地）：

- `src/commands`：顶层命令处理逻辑（新增 `create` / `init`）
- `src/core`：共享的生成、交互、文件系统、渲染与 git 逻辑
- `templates`：按平台和项目类型组织的模板目录

## 模板规则

修改模板时必须保持分层结构：

- 通用模板放在 `templates/shared`
- 平台模板放在 `templates/github` 或 `templates/gitlab`
- 技术栈模板必须限定在 `node`、`spring-maven` 或 `generic`

新增模板时：

- 优先使用占位符，不要写死具体项目值
- 生成结果应尽量精简、易审查
- 避免在 GitHub 和 GitLab 模板之间引入隐式耦合
- 新增必要变量时，要在代码或附近文档中说明

## 跨平台规则

这个 CLI 必须持续兼容 Windows。

规则：

- 实现代码中不要依赖 bash 专属语法
- 运行时不要要求 `sed`、`grep`、`cp`、`rm` 这类 Unix 命令
- 优先使用 Node.js 的 `fs`、`path` 和 `child_process`
- 使用 `path.resolve`、`path.join` 等跨平台路径处理方式
- 运行时行为要兼容 Git Bash、PowerShell 和常见标准 shell

## Git 规则

- 使用 `git` 做仓库检测与初始化
- 不要假设目标目录已经是 git 仓库
- `init` 流程优先采用安全、非破坏式写入
- 如果后续增加覆盖写入能力，必须是显式开启且可预览的

## 验证规则

在声明改动完成前，至少执行：

- 运行 `npm run build`
- 运行最小相关 CLI 烟雾测试
- 检查 `git status --short`
- 确认没有引入对 Unix 专属命令的运行时依赖

当模板或生成逻辑发生变化时，优先至少验证一条 GitHub 路径和一条 GitLab 路径。

## 编辑规则

- 默认使用 ASCII
- 注释保持简洁，仅用于解释不明显的行为
- 不要提交 `/tmp` 下生成的测试目录
- 不要提交 `node_modules`
- `dist` 只有在仓库明确决定发布构建产物时才提交，否则保持忽略

## 决策原则

在多个实现方案之间选择时：

- 优先选择更直接的生成逻辑，而不是过度抽象
- 优先使用明确的模板目录，而不是过度动态化的机制
- 优先安全默认值，而不是带破坏性的自动化
- 优先选择容易通过 CLI 验证的行为
