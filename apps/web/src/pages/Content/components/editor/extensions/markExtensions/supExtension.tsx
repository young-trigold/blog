import { MarkSpec } from 'prosemirror-model';
import { ExtensionTag, MarkExtension } from '..';
import EditorStore from '../../store';

class SupExtension extends MarkExtension {
	static extensionName = 'sup';

	get name() {
		return SupExtension.extensionName;
	}

	editorStore: EditorStore | null = null;

	createTags() {
		return [ExtensionTag.FormattingMark, ExtensionTag.FontStyle];
	}

	createMarkSpec(): MarkSpec {
		const supMarkSpec: MarkSpec = {
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
}

export default SupExtension;
