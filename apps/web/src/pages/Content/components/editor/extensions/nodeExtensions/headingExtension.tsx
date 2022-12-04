import getUniqueId from '@/utils/getUniqueId';
import { InputRule, textblockTypeInputRule } from 'prosemirror-inputrules';
import { NodeSpec, ParseRule } from 'prosemirror-model';
import { PasteRule } from 'prosemirror-paste-rules';
import { Plugin, PluginKey } from 'prosemirror-state';
import { extensionName } from '../decorators/extensionName';
import { ExtensionTag, NodeExtension } from '../type';

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
					default: null,
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
		const pasteRule: PasteRule = {
			type: 'node',
			nodeType: this.type,
			regexp: new RegExp(`^#{1,${HeadingMaxLevel}}\\s([\\s\\w]+)$`),
			getAttributes(match: RegExpMatchArray) {
				return { level: match[1].length, headingId: getUniqueId() };
			},
			startOfTextBlock: true,
		};
		return [pasteRule];
	}
	createPlugin(): void | Plugin<any> {
		const key = new PluginKey('addHeadingId');
		const plugin = new Plugin({
			key,
			appendTransaction: (transactions, oldState, newState) => {
				let tr = newState.tr;
				const headingIdCache = new Set();
				newState.doc.descendants((node, position) => {
					if (!(node.type.name === HeadingExtension.extensionName)) return;
					const headingId = node.attrs.headingId;
					if (!headingId || headingIdCache.has(headingId)) {
						const newHeadingId = getUniqueId();
						tr = tr.setNodeMarkup(position, node.type, {
							...node.attrs,
							headingId: newHeadingId,
						});
					} else {
						headingIdCache.add(headingId);
					}
				});

				return tr;
			},
		});
		return plugin;
	}
}
