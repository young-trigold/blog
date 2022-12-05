import { MarkSpec } from 'prosemirror-model';
import { extensionName } from '../decorators/extensionName';
import { ExtensionTag, MarkExtension } from '../type';

@extensionName('code')
export class CodeExtension extends MarkExtension {
	createMarkSpec(): MarkSpec {
		const codeMarkSpec: MarkSpec = {
			group: [ExtensionTag.FormattingMark, ExtensionTag.FontStyle].join(' '),
			parseDOM: [
				{
					tag: 'code',
				},
			],
			toDOM() {
				return ['code', 0];
			},
		};

		return codeMarkSpec;
	}
}
