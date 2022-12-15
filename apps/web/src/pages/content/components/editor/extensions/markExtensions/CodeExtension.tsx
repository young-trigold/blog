import { toggleMark } from 'prosemirror-commands';
import { InputRule } from 'prosemirror-inputrules';
import { MarkSpec } from 'prosemirror-model';
import { MarkPasteRule } from 'prosemirror-paste-rules';
import { Command } from 'prosemirror-state';
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
		return [markInputRule(new RegExp(`(?:\`)([^\`\uFFFC]+)(?:\`)$`), this.type)];
	}

	createPasteRules(): MarkPasteRule[] {
		return [{ type: 'mark', markType: this.type, regexp: /(?:^|\s)((?:`)((?:[^`]+))(?:`))/g }];
	}

	toggleCode() {
		return toggleMark(this.type);
	}

	createCommands(): Record<string, (...args: any[]) => Command> {
		return {
			toggle: this.toggleCode.bind(this),
		};
	}

	createKeyMap(): KeyMap {
		const keyMapForWin: KeyMap = {
			[`${FunctionKeys.Ctrl}-${SymbolKeys['`']}`]: this.toggleCode(),
		};

		const keyMapForMac: KeyMap = {
			[`${FunctionKeys.Mod}-${SymbolKeys['`']}`]: this.toggleCode(),
		};

		return environment.isMac ? keyMapForMac : keyMapForWin;
	}
}

declare global {
	namespace EditorStore {
		interface Commands {
			code: {
				toggle: () => void;
			};
		}
	}
}
