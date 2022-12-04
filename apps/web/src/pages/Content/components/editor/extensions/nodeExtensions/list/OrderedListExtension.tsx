import { NodeSpec } from 'prosemirror-model';
import { extensionName, NodeExtension } from '../../type';
import { ListItemExtension } from './listItemExtension';

@extensionName('ordered_list')
export class OrderedListExtension extends NodeExtension {
	createNodeSpec(): NodeSpec {
		const orderedListSpec: NodeSpec = {
			defining: true,
			draggable: false,
			content: `${ListItemExtension.extensionName}*`,
			parseDOM: [{ tag: 'ol' }],
			toDOM() {
				return ['ol', 0];
			},
		};

		return orderedListSpec;
	}
}
