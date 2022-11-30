import { MarkSpec } from 'prosemirror-model';
import { MarkExtension } from '..';
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
		const linkMarkSpec: MarkSpec = {
			attrs: {
				href: {
					default: '',
				},
			},
			parseDOM: [
				{
					tag: 'a',
					getAttrs(node) {
						if (!(node instanceof HTMLAnchorElement)) return false;
						const href = node.getAttribute('href');
						return {
							href,
						};
					},
				},
			],
			toDOM(mark) {
				return ['a', { href: mark.attrs.href }, 0];
			},
		};

		return linkMarkSpec;
	}
}

export default LinkExtension;
