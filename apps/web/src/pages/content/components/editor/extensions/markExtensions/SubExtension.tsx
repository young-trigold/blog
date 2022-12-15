import { toggleMark } from 'prosemirror-commands';
import { MarkSpec } from 'prosemirror-model';
import { Command } from 'prosemirror-state';
import { extensionName } from '../decorators/extensionName';
import { ExtensionTag, MarkExtension } from '../type';
import { SupExtension } from './SupExtension';

@extensionName('sub')
export class SubExtension extends MarkExtension {
	createMarkSpec(): MarkSpec {
		const subMarkSpec: MarkSpec = {
			group: [ExtensionTag.FormattingMark, ExtensionTag.FontStyle].join(' '),
			excludes: [SupExtension].map((extension) => extension.extensionName).join(' '),
			parseDOM: [
				{
					tag: 'sub',
				},
			],
			toDOM() {
				return ['sub', 0];
			},
		};

		return subMarkSpec;
	}

	toggleSub() {
		return toggleMark(this.type);
	}

	createCommands(): Record<string, (...args: any[]) => Command> {
		return {
			toggle: this.toggleSub.bind(this),
		};
	}
}

declare global {
	namespace EditorStore {
		interface Commands {
			sub: {
				toggle: () => void;
			};
		}
	}
}
