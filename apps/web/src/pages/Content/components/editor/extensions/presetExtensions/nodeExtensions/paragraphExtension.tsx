import { NodeSpec } from 'prosemirror-model';
import { ExtensionTag, NodeExtension } from '../..';

class ParagraphExtension extends NodeExtension {
	static extensionName = 'paragraph';
	get name() {
		return ParagraphExtension.extensionName;
	}

	createTags() {
		return [
			ExtensionTag.LastNodeCompatible,
			ExtensionTag.TextBlock,
			ExtensionTag.Block,
			ExtensionTag.FormattingNode,
		];
	}

	createNodeSpec(): NodeSpec {
		return {
			content: `${ExtensionTag.Inline}*`,
			draggable: false,
			parseDOM: [
				{
					tag: 'p',
				},
			],
			toDOM() {
				return ['p', 0];
			},
		};
	}
}

export default ParagraphExtension;
