import { MarkSpec } from 'prosemirror-model';
import { extensionName } from '../decorators/extensionName';
import { ExtensionTag, MarkExtension } from '../type';
import { SupExtension } from './SupExtension';

@extensionName('sub')
export class SubExtension extends MarkExtension {
	createMarkSpec(): MarkSpec {
		const subMarkSpec: MarkSpec = {
			group: [ExtensionTag.FormattingMark, ExtensionTag.FontStyle].join(' '),
			excludes: [SupExtension].map((extension) => extension.extensionName).join(' '),
			parseDOM: [
				{
					tag: 'sub',
				},
			],
			toDOM() {
				return ['sub', 0];
			},
		};

		return subMarkSpec;
	}
}
