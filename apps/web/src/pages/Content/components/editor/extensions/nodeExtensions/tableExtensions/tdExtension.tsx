import { NodeSpec } from 'prosemirror-model';
import { extensionName } from '../../decorators/extensionName';
import TextExtension from '../../presetExtensions/nodeExtensions/textExtension';
import { NodeExtension } from '../../type';
import { cellAttrs, getCellAttrs, setCellAttrs } from './uitls';

@extensionName('td')
export class TdExtension extends NodeExtension {
	createNodeSpec(): NodeSpec {
		const tdSpec: NodeSpec = {
			content: `${TextExtension.extensionName}*`,
			attrs: cellAttrs,
			tableRole: 'cell',
			isolating: true,
			parseDOM: [
				{
					tag: 'td',
					getAttrs: (dom: Node | string) => getCellAttrs(dom as HTMLElement, cellAttrs),
				},
			],
			toDOM(node) {
				return ['td', setCellAttrs(node, cellAttrs), 0];
			},
		};

		return tdSpec;
	}
}