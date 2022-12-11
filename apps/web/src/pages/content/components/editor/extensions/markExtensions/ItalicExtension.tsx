import { toggleMark } from 'prosemirror-commands';
import { InputRule } from 'prosemirror-inputrules';
import { MarkSpec } from 'prosemirror-model';
import { environment } from '../../utils/enviroment';
import markInputRule from '../../utils/markInputRule';
import { extensionName } from '../decorators/extensionName';
import { ExtensionTag, FunctionKeys, KeyMap, LetterKeys, MarkExtension } from '../type';

@extensionName('italic')
export class ItalicExtension extends MarkExtension {
	createMarkSpec(): MarkSpec {
		const italicMarkSpec: MarkSpec = {
			group: [ExtensionTag.FormattingMark, ExtensionTag.FontStyle].join(' '),
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

	createKeyMap(): KeyMap {
		const keyMapForWin: KeyMap = {
			[`${FunctionKeys.Ctrl}-${LetterKeys.i}`]: toggleMark(this.type),
		};

		const keyMapForMac: KeyMap = {
			[`${FunctionKeys.Mod}-${LetterKeys.i}`]: toggleMark(this.type),
		};

		return environment.isMac ? keyMapForMac : keyMapForWin;
	}
}
