import { NodeSpec } from 'prosemirror-model';
import { extensionName } from '../../decorators/extensionName';
import { NodeExtension } from '../../type';
import { TrExtension } from './trExtension';

@extensionName('tbody')
export class TBodyExtension extends NodeExtension {
	createNodeSpec(): NodeSpec {
		const tbodySpec: NodeSpec = {
			content: `${TrExtension.extensionName}*`,
			tableRole: 'table_body',
			isolating: true,
			group: 'block',
			// allowGapCursor: true,
			parseDOM: [
				{
					tag: 'tbody',
				},
			],
			toDOM() {
				return ['tbody', 0];
			},
		};

		return tbodySpec;
	}
}
