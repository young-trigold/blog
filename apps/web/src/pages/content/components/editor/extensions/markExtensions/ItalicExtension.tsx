import { toggleMark } from 'prosemirror-commands';
import { InputRule } from 'prosemirror-inputrules';
import { MarkSpec } from 'prosemirror-model';
import { Command } from 'prosemirror-state';
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

	toggleItalic() {
		return toggleMark(this.type);
	}

	createCommands(): Record<string, (...args: any[]) => Command> {
		return {
			toggle: this.toggleItalic.bind(this),
		};
	}

	createKeyMap(): KeyMap {
		const keyMapForWin: KeyMap = {
			[`${FunctionKeys.Ctrl}-${LetterKeys.i}`]: this.toggleItalic(),
		};

		const keyMapForMac: KeyMap = {
			[`${FunctionKeys.Mod}-${LetterKeys.i}`]: this.toggleItalic(),
		};

		return environment.isMac ? keyMapForMac : keyMapForWin;
	}
}

declare global {
	namespace EditorStore {
		interface Commands {
			italic: {
				toggle: () => void;
			};
		}
	}
}
