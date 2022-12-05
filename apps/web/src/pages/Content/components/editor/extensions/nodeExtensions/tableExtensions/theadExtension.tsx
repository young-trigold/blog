import { NodeSpec } from 'prosemirror-model';
import { extensionName } from '../../decorators/extensionName';
import { ExtensionTag, NodeExtension } from '../../type';
import { TrExtension } from './trExtension';

@extensionName('thead')
export class THeadExtension extends NodeExtension {
	createNodeSpec(): NodeSpec {
		const theadSpec: NodeSpec = {
			tableRole: 'table_head',
			isolating: true,
			group: [ExtensionTag.Block].join(' '),
			content: `${TrExtension.extensionName}*`,
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
