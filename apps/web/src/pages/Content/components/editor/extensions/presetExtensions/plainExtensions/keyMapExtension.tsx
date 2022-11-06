import { PlainExtension } from '../..';

class KeyMapExtension extends PlainExtension {
	get name() {
		return 'keyMap' as const;
	}

	onEditorStoreCreate?(): void {}
}

export default KeyMapExtension;
