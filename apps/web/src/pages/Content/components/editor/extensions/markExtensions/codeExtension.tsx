import { MarkSpec } from 'prosemirror-model';
import { ExtensionTag, MarkExtension } from '..';
import EditorStore from '../../store';

class CodeExtension extends MarkExtension {
	static extensionName = 'code';

	get name() {
		return CodeExtension.extensionName;
	}

	editorStore: EditorStore | null = null;

	createTags() {
		return [ExtensionTag.FormattingMark, ExtensionTag.FontStyle];
	}

	createMarkSpec(): MarkSpec {
		const codeMarkSpec: MarkSpec = {
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
}

export default CodeExtension;
