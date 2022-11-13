# 编辑器插件化

## 简介

- 将每一个编辑功能点（如 bold，加粗）的 scheme(mark/node), inputrules, shortcuts, commands 逻辑集中到一个对象上。这个对象就称为 extension。
- extension 可以用以下方式配置化地安装到一个编辑器。

```tsx
interface EditorProps {
	extensions: EditorExtension[];
}

const extensions = [new BoldExtension(), new ItalicExtension()];

const { editorStore, editorState, setEditorState } = useEditorStore({
	extensions,
	doc,
});

<Editor editorState={editorState} />
```

## 实现

# 样式框架迁移至 scss

# 渲染方式迁移至 Nextjs SSR
