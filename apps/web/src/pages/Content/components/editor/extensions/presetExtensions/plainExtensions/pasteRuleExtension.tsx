import { PlainExtension } from '../..';

class PasteRuleExtension extends PlainExtension {
	get name() {
		return 'pasteRule' as const;
	}

	onEditorStoreCreate?(): void {}
}

export default PasteRuleExtension;
