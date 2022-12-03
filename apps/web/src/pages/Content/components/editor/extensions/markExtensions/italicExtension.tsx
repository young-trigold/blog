import { MarkSpec } from 'prosemirror-model';
import { extensionName, ExtensionTag, MarkExtension } from '../type';

@extensionName('italic')
export class ItalicExtension extends MarkExtension {
	createTags() {
		return [ExtensionTag.FormattingMark, ExtensionTag.FontStyle];
	}

	createMarkSpec(): MarkSpec {
		const italicMarkSpec: MarkSpec = {
			parseDOM: [
				{
					tag: 'em',
				},
				{
					tag: 'i',
				},
			],
			toDOM() {
				return ['em', 0];
			},
		};

		return italicMarkSpec;
	}
}
