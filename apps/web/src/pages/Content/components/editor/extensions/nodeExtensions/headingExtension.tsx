import { NodeSpec, ParseRule } from 'prosemirror-model';
import { NodePasteRule, PasteRule } from 'prosemirror-paste-rules';
import TextExtension from '../presetExtensions/nodeExtensions/textExtension';
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
			content: `${TextExtension.extensionName}*`,
			defining: true,
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
}
