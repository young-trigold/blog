import { MarkSpec } from 'prosemirror-model';
import { extensionName, ExtensionTag, MarkExtension } from '../type';

@extensionName('underline')
export class UnderlineExtension extends MarkExtension {
	createTags() {
		return [ExtensionTag.FormattingMark, ExtensionTag.FontStyle];
	}

	createMarkSpec(): MarkSpec {
		const underlineMarkSpec: MarkSpec = {
			parseDOM: [
				{
					tag: 'u',
				},
			],
			toDOM() {
				return ['u', 0];
			},
		};

		return underlineMarkSpec;
	}
}
