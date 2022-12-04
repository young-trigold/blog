import { InputRule } from 'prosemirror-inputrules';
import { MarkSpec } from 'prosemirror-model';
import markInputRule from '../../utils/markInputRule';
import { extensionName } from '../decorators/extensionName';
import { ExtensionTag, MarkExtension } from '../type';

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

	createInputRules(): InputRule[] {
		return [markInputRule(/_(\S(?:|.*?\S))_$/, this.type)];
	}
}
