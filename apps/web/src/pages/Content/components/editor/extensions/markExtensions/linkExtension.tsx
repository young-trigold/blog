import { MarkSpec } from 'prosemirror-model';
import { extensionName, MarkExtension } from '../type';

@extensionName('link')
export class LinkExtension extends MarkExtension {
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
