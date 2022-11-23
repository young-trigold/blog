import { NodeSpec } from 'prosemirror-model';
import { ExtensionTag, NodeExtension } from '..';

class HeadingExtension extends NodeExtension {
	get name() {
		return 'heading';
	}
	createTags?(): ExtensionTag[] {
		return [];
	}
	createNodeSpec(): NodeSpec {
		return {
			attrs: {
				level: {
					default: 1,
				},
				lineHeight: {
					default: '2em',
				},
			},
			parseDOM: [
				{
					tag: 'h1',
					getAttrs(node) {
						return {
							lineHeight: (node as HTMLElement).getAttribute('data-line-height'),
						};
					},
				},
			],
			toDOM(node) {
				return [
					'h1',
					{
						style: { lineHeight: node.attrs.lineHeight },
						'data-line-height': node.attrs.lineHeight,
					},
					0,
				];
			},
		};
	}
}

export default HeadingExtension;
