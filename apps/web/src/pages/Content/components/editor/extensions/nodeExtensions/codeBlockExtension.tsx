import { NodeSpec } from 'prosemirror-model';
import { ExtensionTag, NodeExtension } from '..';
import TextExtension from '../presetExtensions/nodeExtensions/textExtension';

class CodeBlockExtension extends NodeExtension {
	static extensionName = 'code_block';
	get name() {
		return CodeBlockExtension.extensionName;
	}
	createTags(): ExtensionTag[] {
		return [ExtensionTag.Block];
	}
	createNodeSpec(): NodeSpec {
		return {
			marks: '',
			defining: true,
			isolating: true,
			draggable: false,
			code: true,
			content: `${TextExtension.extensionName}*`,
			parseDOM: [
				{
					tag: 'pre',
					preserveWhitespace: 'full',
				},
			],
			toDOM() {
				return ['pre', ['code', 0]];
			},
		};
	}
}

export default CodeBlockExtension;
