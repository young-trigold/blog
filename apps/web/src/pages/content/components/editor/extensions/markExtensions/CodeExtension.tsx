import { toggleMark } from 'prosemirror-commands';
import { InputRule } from 'prosemirror-inputrules';
import { MarkSpec } from 'prosemirror-model';
import { environment } from '../../utils/enviroment';
import markInputRule from '../../utils/markInputRule';
import { extensionName } from '../decorators/extensionName';
import { ExtensionTag, FunctionKeys, KeyMap, MarkExtension, SymbolKeys } from '../type';

@extensionName('code')
export class CodeExtension extends MarkExtension {
	createMarkSpec(): MarkSpec {
		const codeMarkSpec: MarkSpec = {
			group: [ExtensionTag.FormattingMark, ExtensionTag.FontStyle].join(' '),
			excludes: '_',
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

	createInputRules(): InputRule[] {
		return [markInputRule(/`([^`\n\r]+)`$/, this.type)];
	}

	createKeyMap(): KeyMap {
		const keyMapForWin: KeyMap = {
			[`${FunctionKeys.Ctrl}-${SymbolKeys['`']}`]: toggleMark(this.type),
		};

		const keyMapForMac: KeyMap = {
			[`${FunctionKeys.Mod}-${SymbolKeys['`']}`]: toggleMark(this.type),
		};

		return environment.isMac ? keyMapForMac : keyMapForWin;
	}
}
