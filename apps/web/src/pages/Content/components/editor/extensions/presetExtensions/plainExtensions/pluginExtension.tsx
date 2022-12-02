import { Plugin as ProseMirrorPlugin } from 'prosemirror-state';
import { Extension, PlainExtension } from '../..';
import EditorStore from '../../../store';

class PluginExtension extends PlainExtension {
	editorStore: EditorStore | null = null;
	static extensionName = 'plugin';
	get name() {
		return PluginExtension.extensionName;
	}

	onEditorStoreCreate(): void {
		if (!this.editorStore) return;
		const createPlugin = (extension: Extension) => extension.createPlugin?.();
		const markPlugins = this.editorStore.markExtensions.map(createPlugin);
		const nodePlugins = this.editorStore.nodeExtensions.map(createPlugin);
		const plainPlugins = this.editorStore.plainExtensions.map(createPlugin);
		const plugins = [...markPlugins, ...nodePlugins, ...plainPlugins].filter(Boolean);
		this.editorStore.plugins = plugins as ProseMirrorPlugin[];
	}
}

export default PluginExtension;
