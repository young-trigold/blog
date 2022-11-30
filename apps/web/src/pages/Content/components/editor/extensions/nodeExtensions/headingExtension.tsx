import { NodeSpec } from 'prosemirror-model';
import { ExtensionTag, NodeExtension } from '..';
import BoldExtension from '../markExtensions/boldExtension';

class HeadingExtension extends NodeExtension {
	static extensionName = 'heading';
	get name() {
		return HeadingExtension.extensionName;
	}
	createTags(): ExtensionTag[] {
		return [ExtensionTag.Block];
	}
	createNodeSpec(): NodeSpec {
		return {
			marks: [BoldExtension].map((extension) => extension.extensionName).join(' '),
			attrs: {
				level: {
					default: 1,
				},
				: {
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
