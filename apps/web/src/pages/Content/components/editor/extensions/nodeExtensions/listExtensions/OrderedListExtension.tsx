import { NodeSpec } from 'prosemirror-model';
import { extensionName } from '../../decorators/extensionName';
import { ExtensionTag, NodeExtension } from '../../type';
import { ListItemExtension } from './listItemExtension';

@extensionName('ordered_list')
export class OrderedListExtension extends NodeExtension {
	createTags(): ExtensionTag[] {
		return [ExtensionTag.Block];
	}
	createNodeSpec(): NodeSpec {
		const orderedListSpec: NodeSpec = {
			defining: true,
			draggable: false,
			content: `${ListItemExtension.extensionName}+`,
			parseDOM: [{ tag: 'ol' }],
			toDOM() {
				return ['ol', 0];
			},
		};

		return orderedListSpec;
	}
}
