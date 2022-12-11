import { MarkSpec } from 'prosemirror-model';
import { extensionName } from '../decorators/extensionName';
import { ExtensionTag, MarkExtension } from '../type';
import { SubExtension } from './SubExtension';

@extensionName('sup')
export class SupExtension extends MarkExtension {
	createMarkSpec(): MarkSpec {
		const supMarkSpec: MarkSpec = {
			group: [ExtensionTag.FormattingMark, ExtensionTag.FontStyle].join(' '),
			excludes: [SubExtension].map((extension) => extension.extensionName).join(' '),
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
