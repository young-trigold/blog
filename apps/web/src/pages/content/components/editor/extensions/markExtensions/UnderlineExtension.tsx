import { toggleMark } from 'prosemirror-commands';
import { MarkSpec } from 'prosemirror-model';
import { Command } from 'prosemirror-state';
import { environment } from '../../utils/enviroment';
import { extensionName } from '../decorators/extensionName';
import { ExtensionTag, FunctionKeys, KeyMap, LetterKeys, MarkExtension } from '../type';

@extensionName('underline')
export class UnderlineExtension extends MarkExtension {
	createMarkSpec(): MarkSpec {
		const underlineMarkSpec: MarkSpec = {
			group: [ExtensionTag.FormattingMark, ExtensionTag.FontStyle].join(' '),
			parseDOM: [
				{
					tag: 'u',
				},
			],
			toDOM() {
				return ['u', 0];
			},
		};

		return underlineMarkSpec;
	}

	toggleUnderline() {
		return toggleMark(this.type);
	}

	createCommands(): Record<string, (...args: any[]) => Command> {
		return {
			toggle: this.toggleUnderline.bind(this),
		};
	}

	createKeyMap(): KeyMap {
		const keyMapForWin: KeyMap = {
			[`${FunctionKeys.Ctrl}-${LetterKeys.u}`]: this.toggleUnderline(),
		};

		const keyMapForMac: KeyMap = {
			[`${FunctionKeys.Mod}-${LetterKeys.u}`]: this.toggleUnderline(),
		};

		return environment.isMac ? keyMapForMac : keyMapForWin;
	}
}
declare global {
	namespace EditorStore {
		interface Commands {
			underline: {
				toggle: () => void;
			};
		}
	}
}
