import { toggleMark } from 'prosemirror-commands';
import { MarkSpec } from 'prosemirror-model';
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

	createKeyMap(): KeyMap {
		const keyMapForWin: KeyMap = {
			[`${FunctionKeys.Ctrl}-${LetterKeys.u}`]: toggleMark(this.type),
		};

		const keyMapForMac: KeyMap = {
			[`${FunctionKeys.Mod}-${LetterKeys.u}`]: toggleMark(this.type),
		};

		return environment.isMac ? keyMapForMac : keyMapForWin;
	}
}
