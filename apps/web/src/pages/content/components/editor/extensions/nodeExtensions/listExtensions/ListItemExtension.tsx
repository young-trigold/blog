import { NodeSpec } from 'prosemirror-model';
import { extensionName } from '../../decorators/extensionName';
import ParagraphExtension from '../../presetExtensions/nodeExtensions/ParagraphExtension';
import { ExtensionTag, KeyMap, NodeExtension } from '../../type';

@extensionName('list_item')
export class ListItemExtension extends NodeExtension {
	createNodeSpec(): NodeSpec {
		const listItemSpec: NodeSpec = {
			defining: true,
			content: `${ParagraphExtension.extensionName} ${ExtensionTag.Block}*`,
			parseDOM: [{ tag: 'li' }],
			toDOM() {
				return ['li', 0];
			},
		};

		return listItemSpec;
	}

	createKeyMap(): KeyMap {
		return {
			Enter: {
				priority: 2,
				command: () => false,
			},
		};
	}
}
