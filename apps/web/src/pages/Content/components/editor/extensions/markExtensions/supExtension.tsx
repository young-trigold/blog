import { MarkSpec } from 'prosemirror-model';
import { extensionName, ExtensionTag, MarkExtension } from '../type';

@extensionName('sup')
export class SupExtension extends MarkExtension {
	createTags() {
		return [ExtensionTag.FormattingMark, ExtensionTag.FontStyle];
	}

	createMarkSpec(): MarkSpec {
		const supMarkSpec: MarkSpec = {
			parseDOM: [
				{
					tag: 'sup',
				},
			],
			toDOM() {
				return ['sup', 0];
			},
		};

		return supMarkSpec;
	}
}
