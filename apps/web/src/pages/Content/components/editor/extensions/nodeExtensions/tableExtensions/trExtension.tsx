import { NodeSpec } from 'prosemirror-model';
import { extensionName } from '../../decorators/extensionName';
import { NodeExtension } from '../../type';
import { TdExtension } from './tdExtension';
import { ThExtension } from './thExtension';

@extensionName('tr')
export class TrExtension extends NodeExtension {
	createNodeSpec(): NodeSpec {
		const trSpec: NodeSpec = {
			content: `(${TdExtension.extensionName}|${ThExtension.extensionName})*`,
			tableRole: 'row',
			parseDOM: [
				{
					tag: 'tr',
				},
			],
			toDOM() {
				return ['tr', 0];
			},
		};

		return trSpec;
	}
}