import { PlainExtension } from '../..';

class DecorationExtension extends PlainExtension {
	get name() {
		return 'decoration' as const;
	}

	onEditorStoreCreate?(): void {}
}

export default DecorationExtension;
