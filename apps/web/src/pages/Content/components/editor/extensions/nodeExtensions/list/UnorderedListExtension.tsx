import { NodeSpec } from 'prosemirror-model';
import { extensionName, NodeExtension } from '../../type';
import { ListItemExtension } from './listItemExtension';

@extensionName('unordered_list')
export class UnorderedListExtension extends NodeExtension {
	createNodeSpec(): NodeSpec {
		const unorderedListSpec: NodeSpec = {
			defining: true,
			draggable: false,
			content: `${ListItemExtension.extensionName}*`,
			parseDOM: [{ tag: 'ul' }],
			toDOM() {
				return ['ul', 0];
			},
		};

		return unorderedListSpec;
	}
}
