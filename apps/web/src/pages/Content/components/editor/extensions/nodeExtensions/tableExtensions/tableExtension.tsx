import { NodeSpec } from 'prosemirror-model';
import { extensionName } from '../../decorators/extensionName';
import { ExtensionTag, NodeExtension } from '../../type';
import { TBodyExtension } from './tbodyExtension';
import { THeadExtension } from './theadExtension';

@extensionName('table')
export class TableExtension extends NodeExtension {
	createNodeSpec(): NodeSpec {
		const tableSpec: NodeSpec = {
			isolating: true,
			tableRole: 'table',
			group: [ExtensionTag.Block].join(' '),
			content: `${THeadExtension.extensionName}? ${TBodyExtension.extensionName}?`,
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
