import { NodeSpec } from 'prosemirror-model';
import { extensionName } from '../../decorators/extensionName';
import TextExtension from '../../presetExtensions/nodeExtensions/textExtension';
import { NodeExtension } from '../../type';
import { cellAttrs, getCellAttrs, setCellAttrs } from './uitls';

@extensionName('th')
export class ThExtension extends NodeExtension {
	createNodeSpec(): NodeSpec {
		const thSpec: NodeSpec = {
			content: `${TextExtension.extensionName}*`,
			attrs: cellAttrs,
			tableRole: 'header_cell',
			isolating: true,
			parseDOM: [
				{
					tag: 'th',
					getAttrs: (dom: Node | string) => getCellAttrs(dom as HTMLElement, cellAttrs),
				},
			],
			toDOM(node) {
				return ['th', setCellAttrs(node, cellAttrs), 0];
			},
		};

		return thSpec;
	}
}