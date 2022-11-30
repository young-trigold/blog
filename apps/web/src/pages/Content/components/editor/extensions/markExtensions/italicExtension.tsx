import { MarkSpec } from 'prosemirror-model';
import { ExtensionTag, MarkExtension } from '..';
import EditorStore from '../../store';

class ItalicExtension extends MarkExtension {
	static extensionName = 'italic';

	get name() {
		return ItalicExtension.extensionName;
	}

	editorStore: EditorStore | null = null;

	createTags() {
		return [ExtensionTag.FormattingMark, ExtensionTag.FontStyle];
	}

	createMarkSpec(): MarkSpec {
		const italicMarkSpec: MarkSpec = {
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
}

export default ItalicExtension;
