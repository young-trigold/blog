import { NodeSpec } from 'prosemirror-model';
import { extensionName } from '../../decorators/extensionName';
import { NodeExtension } from '../../type';
import { TBodyExtension } from './tbodyExtension';
import { THeadExtension } from './theadExtension';

@extensionName('table')
export class TableExtension extends NodeExtension {
	createNodeSpec(): NodeSpec {
		const tableSpec: NodeSpec = {
			content: `${THeadExtension.extensionName}? ${TBodyExtension.extensionName}?`,
			tableRole: 'table',
			isolating: true,
			group: 'block',
			// allowGapCursor: true,
			parseDOM: [
				{
					tag: 'table',
				},
			],
			toDOM() {
				return ['table', 0];
			},
		};

		return tableSpec;
	}
}
