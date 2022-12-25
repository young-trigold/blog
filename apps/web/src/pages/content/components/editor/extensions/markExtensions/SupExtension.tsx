import { toggleMark } from 'prosemirror-commands';
import { MarkSpec } from 'prosemirror-model';
import { Command } from 'prosemirror-state';
import { extensionName } from '../decorators/extensionName';
import { CommandType, ExtensionTag, MarkExtension } from '../type';
import { SubExtension } from './SubExtension';

@extensionName('sup')
export class SupExtension extends MarkExtension {
	createMarkSpec(): MarkSpec {
		const supMarkSpec: MarkSpec = {
			group: [ExtensionTag.FormattingMark, ExtensionTag.FontStyle].join(' '),
			excludes: [SubExtension].map((extension) => extension.extensionName).join(' '),
			parseDOM: [
				{
					tag: 'sup',
				},
			],
			toDOM() {
				return ['sup', 0];
			},
		};

		return supMarkSpec;
	}

	toggleSup() {
		return toggleMark(this.type);
	}

	createCommands() {
		return {
			toggle: this.toggleSup.bind(this),
		};
	}
}

declare global {
	namespace EditorStore {
		interface Commands {
			sup: CommandType<SupExtension>;
		}
	}
}
