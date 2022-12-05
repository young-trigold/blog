import { NodeSpec } from 'prosemirror-model';
import { extensionName } from '../../decorators/extensionName';
import { NodeExtension } from '../../type';
import { TrExtension } from './trExtension';

@extensionName('thead')
export class THeadExtension extends NodeExtension {
	createNodeSpec(): NodeSpec {
		const theadSpec: NodeSpec = {
			content: `${TrExtension.extensionName}*`,
			tableRole: 'table_head',
			isolating: true,
			group: 'block',
			// allowGapCursor: true,
			parseDOM: [
				{
					tag: 'thead',
				},
			],
			toDOM() {
				return ['thead', 0];
			},
		};

		return theadSpec;
	}
}
