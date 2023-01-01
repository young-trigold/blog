# 编辑器插件化架构(已实现)

富文本编辑器插件化的 idea 如下：

- 将每一个编辑功能点（如 bold，加粗）的 scheme(mark/node), inputrules, pasteRule, keymap, commands, nodeview, plugin 等逻辑集中到一个对象上。这个对象就称为 extension。
- extension 可以配置化地安装到一个编辑器。

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

插件可以配置化地安装到一个编辑器：

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

# 迁移至 NextJS + NestJS 框架
