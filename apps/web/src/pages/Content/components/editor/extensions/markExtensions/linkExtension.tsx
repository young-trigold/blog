import { MarkSpec } from 'prosemirror-model';
import { ExtensionTag, MarkExtension } from '..';
import EditorStore from '../../store';

class LinkExtension extends MarkExtension {
	static extensionName = 'link';

	get name() {
		return LinkExtension.extensionName;
	}

	editorStore: EditorStore | null = null;

	createTags() {
		return [];
	}

	createMarkSpec(): MarkSpec {
		const underlineMarkSpec: MarkSpec = {
			parseDOM: [
				{
					tag: 'a',
				},
			],
			toDOM() {
				return ['u', 0];
			},
		};

		return underlineMarkSpec;
	}
}

export default LinkExtension;
