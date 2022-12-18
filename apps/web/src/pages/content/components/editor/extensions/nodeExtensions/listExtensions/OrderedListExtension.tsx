import { InputRule, wrappingInputRule } from 'prosemirror-inputrules';
import { NodeSpec } from 'prosemirror-model';
import { extensionName } from '../../decorators/extensionName';
import { ExtensionTag, NodeExtension } from '../../type';
import { ListItemExtension } from './ListItemExtension';

@extensionName('ordered_list')
export class OrderedListExtension extends NodeExtension {
	createNodeSpec(): NodeSpec {
		const orderedListSpec: NodeSpec = {
			defining: true,
			draggable: false,
			attrs: {
				order: {
					default: 1,
				},
			},
			group: [ExtensionTag.Block].join(' '),
			content: `${ListItemExtension.extensionName}+`,
			parseDOM: [{ tag: 'ol' }],
			toDOM() {
				return ['ol', 0];
			},
		};

		return orderedListSpec;
	}

	createInputRules(): InputRule[] {
		const regexp = /^(\d+)\.\s$/;

		return [
			wrappingInputRule(
				regexp,
				this.type,
				(match) => ({ order: Number.parseInt(match[1] ?? '1', 10) }),
				(match, node) =>
					node.childCount + (node.attrs.order as number) === Number.parseInt(match[1], 10),
			),

			new InputRule(regexp, (state, match, start, end) => {
				const tr = state.tr;
				tr.deleteRange(start, end);
				const canUpdate = wrapSelectedItems({
					listType: this.type,
					itemType: this.editorStore!.schema!.nodes[ListItemExtension.extensionName]!,
					tr,
				});

				if (!canUpdate) {
					return null;
				}

				const order = Number.parseInt(match[1], 10);

				if (order !== 1) {
					const found = findParentNodeOfType({ selection: tr.selection, types: this.type });

					if (found) {
						tr.setNodeMarkup(found.pos, undefined, { order });
					}
				}

				return tr;
			}),
		];
	}
}
