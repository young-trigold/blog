import { NodeSpec } from 'prosemirror-model';
import ParagraphExtension from '../../presetExtensions/nodeExtensions/paragraphExtension';
import { extensionName, NodeExtension } from '../../type';

@extensionName('list_item')
export class ListItemExtension extends NodeExtension {
	createNodeSpec(): NodeSpec {
		const listItemSpec: NodeSpec = {
			defining: true,
			content: `${ParagraphExtension.extensionName}`,
			parseDOM: [{ tag: 'li' }],
			toDOM() {
				return ['li', 0];
			},
		};

		return listItemSpec;
	}
}
