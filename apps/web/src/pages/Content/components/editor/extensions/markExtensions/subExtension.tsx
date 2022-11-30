import { MarkSpec } from 'prosemirror-model';
import { ExtensionTag, MarkExtension } from '..';
import EditorStore from '../../store';

class SubExtension extends MarkExtension {
	static extensionName = 'sub';

	get name() {
		return SubExtension.extensionName;
	}

	editorStore: EditorStore | null = null;

	createTags() {
		return [ExtensionTag.FormattingMark, ExtensionTag.FontStyle];
	}

	createMarkSpec(): MarkSpec {
		const subMarkSpec: MarkSpec = {
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
}

export default SubExtension;
