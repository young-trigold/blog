import { Plugin, PluginKey } from 'prosemirror-state';
import { NodeViewConstructor } from 'prosemirror-view';
import { extensionName, PlainExtension } from '../..';

@extensionName('node_view')
class NodeViewExtension extends PlainExtension {
	createPlugin(): void | Plugin<any> {
		if (!this.editorStore) return;
		const key = new PluginKey(NodeViewExtension.extensionName);
		const nodeViews = this.editorStore.nodeExtensions.reduce((result, extension) => {
			if (extension.createNodeView) result[extension.name] = extension.createNodeView();
			return result;
		}, {} as Record<string, NodeViewConstructor>);

		const plugin = new Plugin({
			key,
			props: {
				nodeViews,
			},
		});

		return plugin;
	}
}

export default NodeViewExtension;
