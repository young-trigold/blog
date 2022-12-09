import { NodeSpec } from 'prosemirror-model';
import { extensionName } from '../decorators/extensionName';
import { ExtensionTag, NodeExtension } from '../type';

@extensionName('image')
export class ImageExtension extends NodeExtension {
	createNodeSpec(): NodeSpec {
		const imageSpec: NodeSpec = {
			inline: true,
			draggable: true,
			selectable: false,
			group: [ExtensionTag.Inline, ExtensionTag.Media].join(' '),
			attrs: {
				src: {
					default: null,
				},
			},
			parseDOM: [
				{
					tag: 'img[src]',
					getAttrs(node) {
						if (!(node instanceof HTMLImageElement)) return false;
						const src = node.getAttribute('src');
						return { src };
					},
				},
			],
			toDOM(node) {
				const { src } = node.attrs;
				return ['img', { src }];
			},
		};

		return imageSpec;
	}
}