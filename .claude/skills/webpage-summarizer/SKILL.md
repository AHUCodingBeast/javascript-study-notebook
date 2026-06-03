---
name: webpage-summarizer
description: 打开指定网页，处理登录等用户交互场景，总结页面主要内容。
allowed-tools: Bash(playwright-cli:*)
---

# 网页总结助手

使用 playwright-cli 打开网页并总结内容，特别处理需要登录的页面（如语雀、Confluence 等）。

## 使用方式

用户提供一个 URL，执行以下流程即可。

## 标准流程

### 1. 打开网页

**必须**使用 `--headed --persistent` 参数，确保浏览器可见且保存登录状态：

```bash
playwright-cli open <URL> --headed --persistent
```

### 2. 检查是否跳转登录页

打开后查看返回的 Page Title 和 URL：
- 如果页面标题包含"登录"、"Login"、"SSO"等关键字，说明需要登录
- 此时提示用户："页面跳转到了登录页，请先登录，完成后告诉我"
- **不要尝试自动填写登录信息**，由用户手动操作

### 3. 用户确认登录后，获取页面快照

```bash
playwright-cli snapshot
```

如果快照内容不完整（页面过长），可配合 `--depth` 参数或滚动后再次 snapshot：

```bash
playwright-cli snapshot --depth=8
# 或滚动到页面底部再取快照
playwright-cli mousewheel 0 5000
playwright-cli snapshot
```

### 4. 总结页面内容

根据 snapshot 返回的 YAML 结构，提取页面标题、作者、各章节标题和正文内容，按结构化格式总结。

总结要求：
- 先给出文章标题、作者、发布时间等基本信息
- 按章节/小节结构组织，提取每个章节的核心观点
- 代码示例只需说明用途，不需要完整复制
- 图片用文字描述其表达的含义
- 保持简洁，每个章节 1-3 句话概括

## 示例：访问语雀文章

```bash
# 打开语雀文章
playwright-cli open https://yuque.alibaba-inc.com/xxx/xxx --headed --persistent

# 用户登录后，获取内容
playwright-cli snapshot

# 根据 snapshot 结果总结
```

## 示例：访问已登录过的页面（persistent 已保存状态）

```bash
# persistent 模式下如果之前已登录，直接访问目标页面
playwright-cli open https://yuque.alibaba-inc.com/xxx/xxx --headed --persistent

# 如果直接加载成功（未跳转登录页），直接获取快照
playwright-cli snapshot
```

## 注意事项

- 始终使用 `--headed --persistent`，不要用默认的 headless 模式
- 登录环节完全由用户操作，不干预
- 如果页面内容很长，可能需要多次 snapshot 或使用 --depth 参数
- 总结完成后可以执行 `playwright-cli close` 关闭浏览器

ctx7sk-48ee9444-4ba3-4756-a745-d4ba39ff20
