import { MarkSpec } from 'prosemirror-model';
import { extensionName } from '../decorators/extensionName';
import { ExtensionTag, MarkExtension } from '../type';

@extensionName('sup')
export class SupExtension extends MarkExtension {
	createMarkSpec(): MarkSpec {
		const supMarkSpec: MarkSpec = {
			group: [ExtensionTag.FormattingMark, ExtensionTag.FontStyle].join(' '),
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
