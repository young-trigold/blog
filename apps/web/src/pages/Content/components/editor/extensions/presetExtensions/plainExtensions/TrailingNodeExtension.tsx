import { Plugin } from 'prosemirror-state';
import { trailingNode } from 'prosemirror-trailing-node';
import { extensionName } from '../../decorators/extensionName';
import { PlainExtension } from '../../type';
import ParagraphExtension from '../nodeExtensions/paragraphExtension';

@extensionName('trailing_node')
export class TrailingNodeExtension extends PlainExtension {
	createPlugin(): void | Plugin<any> {
		return trailingNode({
			ignoredNodes: [],
			nodeName: ParagraphExtension.extensionName,
		});
	}
}
