# 1. 我的博客

- 主页：[在线体验](http://www.trigold.tech/)
- （富文本编辑器）编辑页：[在线体验](http://www.trigold.tech/edit/articles/638e2cf04b6f17eaafbcd240)
- 阅读页：[在线体验](http://www.trigold.tech/articles/638e2cf04b6f17eaafbcd240)
- 后台：[在线体验](http://www.trigold.tech/admin)

# 2. 功能与亮点

## 2.1. 富文本编辑

- 编辑器插件化（整体 2.0 架构，大大提升可维护性）

富文本编辑器插件化的 idea 如下：

将每一个编辑功能点（如 bold，加粗）的 scheme(mark/node), inputrules, pasteRule, keymap, commands, nodeview, plugin 等逻辑集中到一个对象上。这个对象就称为 extension。extension 可以配置化地安装到一个编辑器。

以下例子展示了标题编辑功能点的插件：**HeadingExtension**：

```tsx
@extensionName('heading')
export class HeadingExtension extends NodeExtension {
	createNodeSpec(): NodeSpec {
		return {
			attrs: {
				level: {
					default: 1,
				},
				headingId: {
					default: null,
				},
			},
			content: `${ExtensionTag.Inline}*`,
			marks: [
				ItalicExtension,
				CodeExtension,
				LinkExtension,
				SubExtension,
				SupExtension,
				UnderlineExtension,
			]
				.map((Extension) => Extension.extensionName)
				.join(' '),
			group: [ExtensionTag.Block, ExtensionTag.TextBlock, ExtensionTag.FormattingNode].join(' '),
			draggable: false,
			defining: true,
			parseDOM: Array.from({ length: HeadingMaxLevel }).map(
				(_, i) =>
					({
						tag: `h${i + 1}`,
						getAttrs(node) {
							if (!(node instanceof HTMLHeadingElement)) return false;
							const headingId = node.getAttribute('data-heading-id');
							return { headingId, level: i + 1 };
						},
					} as ParseRule),
			),
			toDOM(node) {
				return [
					`h${node.attrs.level}`,
					{
						'data-heading-id': node.attrs.headingId,
					},
					0,
				];
			},
		};
	}

	createInputRules(): InputRule[] {
		const inputRule = textblockTypeInputRule(
			new RegExp(`^(#{1,${HeadingMaxLevel}})\\s$`),
			this.type,
			(match: RegExpMatchArray) => ({
				level: match[1].length,
				headingId: getUniqueId(),
			}),
		);
		return [inputRule];
	}

	createPasteRules(): PasteRule[] {
		const pasteRules: PasteRule[] = Array.from({ length: HeadingMaxLevel }).map((_, i) => ({
			type: 'node',
			nodeType: this.type,
			regexp: new RegExp(`^#{${i + 1}}\\s([\\s\\w]+)$`),
			getAttributes: () => ({ level: i + 1 }),
			startOfTextBlock: true,
		}));
		return pasteRules;
	}

	toggleHeading(level: number) {
		return toggleBlockItem({
			type: this.type,
			attrs: {
				level,
			},
		});
	}

	createCommands() {
		return {
			toggle: this.toggleHeading.bind(this),
		};
	}

	createPlugins() {
		const key = new PluginKey('add_heading_id');
		const plugin = new Plugin({
			key,
			appendTransaction: (transactions, oldState, newState) => {
				let tr = newState.tr;
				const headingIdCache = new Set();
				newState.doc.descendants((node, position) => {
					if (!(node.type.name === HeadingExtension.extensionName)) return;
					const headingId = node.attrs.headingId;
					if (!headingId || headingIdCache.has(headingId)) {
						const newHeadingId = getUniqueId();
						tr = tr.setNodeMarkup(position, node.type, {
							...node.attrs,
							headingId: newHeadingId,
						});
					} else {
						headingIdCache.add(headingId);
					}
				});

				return tr;
			},
		});
		return [plugin];
	}
}
```

- 自定义 insertTooltip，selectionTooltip
- 编辑功能点：粗体，斜体，下划线，上下标，链接，行内代码，代码块，标题，段落，图片，列表，表格等

## 2.2. 目录与锚点跟随

- 根据条目内容生成目录
- 点击目录，跳转至对应标题
- 正文滚动，更新当前目录和锚点
- 锚点状态嵌入 URL，可根据 URL 跳转

## 2.3. 划词评论

- 选择条目内一段文本，可根据选中文本差异化评论（实现中...）

## 2.4. 认证与后台

- 登录/注册与密码认证
- 后台可对条目进行增删改查

## 2.5. 主题切换

- 暗色/亮色主题切换
- 丰富的主题

## 2.6. 响应式

- 完美适配移动端和 PC 端

## 2.7. 不依赖任何组件库

- modal message input button 等等用到的组件都是自定义

# 3. 技术栈

- 语言：typescript

## 3.1. 前端

- 框架：react hooks, redux, prosemirror, styled-components

## 3.2. 后端

- 框架：express, mongoose
