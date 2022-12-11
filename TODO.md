# ~~编辑器插件化(已实现)~~

- 将每一个编辑功能点（如 bold，加粗）的 scheme(mark/node), inputrules, shortcuts, commands, plugin 逻辑集中到一个对象上。这个对象就称为 extension。
- extension 可以配置化地安装到一个编辑器。

以下是一个实际例子。

BoldExtension

```tsx
@extensionName('bold')
export class BoldExtension extends MarkExtension {
	createMarkSpec(): MarkSpec {
		const boldMarkSpec: MarkSpec = {
			group: [ExtensionTag.FormattingMark, ExtensionTag.FontStyle].join(' '),
			parseDOM: [
				{
					tag: 'strong',
				},
				{
					tag: 'b',
				},
			],
			toDOM() {
				return ['strong', 0];
			},
		};

		return boldMarkSpec;
	}

	createInputRules(): InputRule[] {
		return [markInputRule(/(?:\*\*|__)([^*_]+)(?:\*\*|__)$/, this.type)];
	}

	createKeyMap(): KeyMap {
		const keyMapForWin: KeyMap = {
			[`${FunctionKeys.Ctrl}-${LetterKeys.b}`]: toggleMark(this.type),
		};

		const keyMapForMac: KeyMap = {
			[`${FunctionKeys.Mod}-${LetterKeys.b}`]: toggleMark(this.type),
		};

		return environment.isMac ? keyMapForMac : keyMapForWin;
	}
}
```

配置化地安装到一个编辑器。

```tsx
const extensions = [
	new BoldExtension(),
	new ItalicExtension(),
	new UnderlineExtension(),
	new LinkExtension(),
	new SubExtension(),
	new SupExtension(),
	new CodeExtension(),
	new HeadingExtension(),
	new CodeBlockExtension(),
	new ImageExtension(),
	...ListExtensions.map((Extension) => new Extension()),
	...TableExtensions.map((Extension) => new Extension()),
];

<Editor
	extensions={extensions}
	doc={editorContent}
	editable={editable}
	autoFocus={true}
	onChange={onChange}
	handleDOMEvents={handleDOMEvents}
/>;
```

# 渲染方式迁移至 Nextjs SSR
