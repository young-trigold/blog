import { NodeSpec, ParseRule } from 'prosemirror-model';
import { ExtensionTag, NodeExtension } from '..';
import ItalicExtension from '../markExtensions/italicExtension';
import LinkExtension from '../markExtensions/linkExtension';
import SubExtension from '../markExtensions/subExtension';
import SupExtension from '../markExtensions/supExtension';
import UnderlineExtension from '../markExtensions/underlineExtension';
import TextExtension from '../presetExtensions/nodeExtensions/textExtension';

export const HeadingMaxLevel = 4;

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
			marks: [ItalicExtension, UnderlineExtension, LinkExtension, SubExtension, SupExtension]
				.map((extension) => extension.extensionName)
				.join(' '),
			attrs: {
				level: {
					default: 1,
				},
				headingId: {
					default: '',
				},
			},
			content: `${TextExtension.extensionName}*`,
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
}

export default HeadingExtension;
