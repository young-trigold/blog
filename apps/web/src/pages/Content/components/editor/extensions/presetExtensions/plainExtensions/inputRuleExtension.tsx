import { PlainExtension } from '../..';

class InputRuleExtension extends PlainExtension {
	get name() {
		return 'inputRule' as const;
	}

	onEditorStoreCreate?(): void {}
}

export default InputRuleExtension;
