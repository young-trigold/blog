import getUniqueId from '@/utils/getUniqueId';
import { InputRule, textblockTypeInputRule } from 'prosemirror-inputrules';
import { NodeSpec, ParseRule } from 'prosemirror-model';
import { NodePasteRule, PasteRule } from 'prosemirror-paste-rules';
import { Plugin, PluginKey } from 'prosemirror-state';
import { extensionName, ExtensionTag, NodeExtension } from '../type';

export const HeadingMaxLevel = 4;

@extensionName('heading')
export class HeadingExtension extends NodeExtension {
	createTags(): ExtensionTag[] {
		return [ExtensionTag.Block];
	}
	createNodeSpec(): NodeSpec {
		return {
			attrs: {
				level: {
					default: 1,
				},
				headingId: {
					default: '',
				},
			},
			content: `${ExtensionTag.Inline}*`,
			defining: true,
			draggable: false,
			parseDOM: Array.from({ length: HeadingMaxLevel }).map(
				(_, i) =>
					({
						tag: `h${i + 1}`,
						getAttrs(node) {
							if (!(node instanceof HTMLHeadingElement)) return false;
							const headingId = node.getAttribute('data-heading-id');
							return { headingId, level: i + 1 };
						},
					} as ParseRule),
			),
			toDOM(node) {
				return [
					`h${node.attrs.level}`,
					{
						'data-heading-id': node.attrs.headingId,
					},
					0,
				];
			},
		};
	}
	createInputRules(): InputRule[] {
		const inputRule = textblockTypeInputRule(
			new RegExp(`^(#{1,${HeadingMaxLevel}})\\s$`),
			this.type,
			(match: RegExpMatchArray) => ({
				level: match[1].length,
			}),
		);
		return [inputRule];
	}
	createPasteRules(): PasteRule[] {
		return Array.from({ length: HeadingMaxLevel }).map(
			(_, i) =>
				({
					type: 'node',
					nodeType: this.type,
					regexp: new RegExp(`^#{${i + 1}}\\s([\\s\\w]+)$`),
					getAttributes() {
						return { level: i + 1 };
					},
					startOfTextBlock: true,
				} as NodePasteRule),
		);
	}
	createPlugin(): void | Plugin<any> {
		const key = new PluginKey('addHeadingId');
		const plugin = new Plugin({
			key,
			appendTransaction: (transactions, oldState, newState) => {
				let tr = newState.tr;
				newState.doc.descendants((node, position) => {
					if (node.type.name === HeadingExtension.extensionName) {
						if (!node.attrs.headingId) {
							tr = tr.setNodeMarkup(position, node.type, {
								...node.attrs,
								headingId: getUniqueId(),
							});
						}
					}
				});

				return tr;
			},
		});
		return plugin;
	}
}
