import { NodeSpec } from 'prosemirror-model';
import { extensionName } from '../../decorators/extensionName';
import { ExtensionTag, NodeExtension } from '../../type';
import { TrExtension } from './trExtension';

@extensionName('tbody')
export class TBodyExtension extends NodeExtension {
	createNodeSpec(): NodeSpec {
		const tbodySpec: NodeSpec = {
			isolating: true,
			tableRole: 'table_body',
			group: [ExtensionTag.Block].join(' '),
			content: `${TrExtension.extensionName}*`,
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
