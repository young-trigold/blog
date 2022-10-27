# 编辑器插件化

## 简介

- 将每一个编辑功能点（如 bold，加粗）的 scheme(mark/node), inputrules, shortcuts, commands 逻辑集中到一个对象上。这个对象就称为 extension。
- extension 可以用以下方式配置化地安装到一个编辑器。

```tsx
type Extensions = Record<keyof ExtensionNames, boolean>;

interface EditorProps {
	extensions: Extensions;
}

<Editor extensions={
	bold: true,
	italic: true,
	table: false,
} />
```

## 实现


