import { NodeSpec } from 'prosemirror-model';
import { extensionName } from '../../decorators/extensionName';
import { ExtensionTag, NodeExtension } from '../../type';

@extensionName('paragraph')
class ParagraphExtension extends NodeExtension {
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
