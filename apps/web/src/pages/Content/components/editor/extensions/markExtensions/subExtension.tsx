import { MarkSpec } from 'prosemirror-model';
import { extensionName } from '../decorators/extensionName';
import { ExtensionTag, MarkExtension } from '../type';

@extensionName('sub')
export class SubExtension extends MarkExtension {
	createTags() {
		return [ExtensionTag.FormattingMark, ExtensionTag.FontStyle];
	}

	createMarkSpec(): MarkSpec {
		const subMarkSpec: MarkSpec = {
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
