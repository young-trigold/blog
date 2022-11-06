import { MarkSpec } from 'prosemirror-model';
import EditorStore from '../store/EditorStore';
import { MarkExtension } from './extension';

class BoldExtension extends MarkExtension {
	editorStore: EditorStore | null = null;

	get name() {
		return 'bold' as const;
	}

	createMarkSpec(): MarkSpec {
		const boldMarkSpec: MarkSpec = {
			parseDOM: [
        {
          tag: 'strong',
          // getAttrs: extra.parse,
        },
        // {
        //   tag: 'b',
        //   getAttrs: (node) =>
        //     isElementDomNode(node) && node.style.fontWeight !== 'normal'
        //       ? extra.parse(node)
        //       : false,
        // },
        // {
        //   style: 'font-weight',
        //   getAttrs: (node) =>
        //     isString(node) && /^(bold(er)?|[5-9]\d{2,})$/.test(node) ? null : false,
        // },
      ],
			toDOM(mark, inline) {
				return ['strong', 0];
			},
		};

		return boldMarkSpec;
	}

	onEditorStoreCreate(): void {}
	onEditorViewCreate(): void {}
}

export default BoldExtension;
