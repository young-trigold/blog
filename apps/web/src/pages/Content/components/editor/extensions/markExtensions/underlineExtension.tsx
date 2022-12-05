import { MarkSpec } from 'prosemirror-model';
import { extensionName } from '../decorators/extensionName';
import { ExtensionTag, MarkExtension } from '../type';

@extensionName('underline')
export class UnderlineExtension extends MarkExtension {
	createMarkSpec(): MarkSpec {
		const underlineMarkSpec: MarkSpec = {
			group: [ExtensionTag.FormattingMark, ExtensionTag.FontStyle].join(' '),
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
