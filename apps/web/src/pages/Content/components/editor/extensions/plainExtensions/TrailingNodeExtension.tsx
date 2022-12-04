import { Plugin } from 'prosemirror-state';
import { trailingNode } from 'prosemirror-trailing-node';
import ParagraphExtension from '../presetExtensions/nodeExtensions/paragraphExtension';
import { extensionName, PlainExtension } from '../type';

@extensionName('trailing_node')
export class TrailingNodeExtension extends PlainExtension {
	createPlugin(): void | Plugin<any> {
		return trailingNode({
			ignoredNodes: [],
			nodeName: ParagraphExtension.extensionName,
		});
	}
}
