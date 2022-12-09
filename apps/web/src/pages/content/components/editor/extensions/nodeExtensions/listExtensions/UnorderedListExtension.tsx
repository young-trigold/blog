import { InputRule, wrappingInputRule } from 'prosemirror-inputrules';
import { NodeSpec } from 'prosemirror-model';
import { extensionName } from '../../decorators/extensionName';
import { ExtensionTag, NodeExtension } from '../../type';
import { ListItemExtension } from './ListItemExtension';

@extensionName('unordered_list')
export class UnorderedListExtension extends NodeExtension {
	createNodeSpec(): NodeSpec {
		const unorderedListSpec: NodeSpec = {
			defining: true,
			draggable: false,
			group: [ExtensionTag.Block].join(' '),
			content: `${ListItemExtension.extensionName}+`,
			parseDOM: [{ tag: 'ul' }],
			toDOM() {
				return ['ul', 0];
			},
		};

		return unorderedListSpec;
	}
	createInputRules(): InputRule[] {
		return [wrappingInputRule(/^\s*([-+*])\s$/, this.type)];
	}
}
