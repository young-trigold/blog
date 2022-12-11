import { toggleMark } from 'prosemirror-commands';
import { InputRule } from 'prosemirror-inputrules';
import { MarkSpec } from 'prosemirror-model';
import { environment } from '../../utils/enviroment';
import markInputRule from '../../utils/markInputRule';
import { extensionName } from '../decorators/extensionName';
import { ExtensionTag, FunctionKeys, KeyMap, LetterKeys, MarkExtension } from '../type';

@extensionName('bold')
export class BoldExtension extends MarkExtension {
	createMarkSpec(): MarkSpec {
		const boldMarkSpec: MarkSpec = {
			group: [ExtensionTag.FormattingMark, ExtensionTag.FontStyle].join(' '),
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

	createKeyMap(): KeyMap {
		const keyMapForWin: KeyMap = {
			[`${FunctionKeys.Ctrl}-${LetterKeys.b}`]: toggleMark(this.type),
		};

		const keyMapForMac: KeyMap = {
			[`${FunctionKeys.Mod}-${LetterKeys.b}`]: toggleMark(this.type),
		};

		return environment.isMac ? keyMapForMac : keyMapForWin;
	}
}
