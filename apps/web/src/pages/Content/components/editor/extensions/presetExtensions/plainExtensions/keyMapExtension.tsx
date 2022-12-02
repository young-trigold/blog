import { Plugin } from 'prosemirror-state';
import { extensionName, PlainExtension } from '../..';

@extensionName('key_map')
class KeyMapExtension extends PlainExtension {
	createPlugin(): void | Plugin<any> {
		if(!this.editorStore) return;
		const markKeyMaps = this.editorStore.markExtensions.map((extension) => extension.createKeyMap?.());
		const nodeKeyMaps = this.editorStore.nodeExtensions.map((extension) => extension.createKeyMap?.());
		
	}
}

export default KeyMapExtension;
