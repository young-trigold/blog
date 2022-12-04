import { InputRule } from 'prosemirror-inputrules';
import { MarkSpec } from 'prosemirror-model';
import markInputRule from '../../utils/markInputRule';
import { extensionName } from '../decorators/extensionName';
import { ExtensionTag, MarkExtension } from '../type';

@extensionName('bold')
export class BoldExtension extends MarkExtension {
	createTags() {
		return [ExtensionTag.FormattingMark, ExtensionTag.FontStyle];
	}

	createMarkSpec(): MarkSpec {
		const boldMarkSpec: MarkSpec = {
			parseDOM: [
				{
					tag: 'strong',
				},
				{
					tag: 'b',
				},
			],
			toDOM() {
				return ['strong', 0];
			},
		};

		return boldMarkSpec;
	}

	createInputRules(): InputRule[] {
		return [markInputRule(/(?:\*\*|__)([^*_]+)(?:\*\*|__)$/, this.type)];
	}
}
