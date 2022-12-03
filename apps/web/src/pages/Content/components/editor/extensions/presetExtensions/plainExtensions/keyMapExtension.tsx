import { baseKeymap } from 'prosemirror-commands';
import { keymap } from 'prosemirror-keymap';
import { Plugin } from 'prosemirror-state';
import { extensionName, KeyMap, PlainExtension } from '../..';

@extensionName('key_map')
class KeyMapExtension extends PlainExtension {
	createPlugin(): void | Plugin<any> {
		if (!this.editorStore) return;
		const markKeyMap = this.editorStore.markExtensions.reduce((result, extension) => {
			if (extension.createKeyMap)
				result = {
					...result,
					...extension.createKeyMap(),
				};
			return result;
		}, {} as KeyMap);
		const nodeKeyMap = this.editorStore.nodeExtensions.reduce((result, extension) => {
			if (extension.createKeyMap)
				result = {
					...result,
					...extension.createKeyMap(),
				};
			return result;
		}, {} as KeyMap);
		const pluginKeyMap = this.editorStore.plainExtensions.reduce((result, extension) => {
			if (extension.createKeyMap)
				result = {
					...result,
					...extension.createKeyMap(),
				};
			return result;
		}, {} as KeyMap);
		const keyMap = {
			...baseKeymap,
			...markKeyMap,
			...nodeKeyMap,
			...pluginKeyMap,
		};
		const keyMapPlugin = keymap(keyMap);
		return keyMapPlugin;
	}
}

export default KeyMapExtension;
