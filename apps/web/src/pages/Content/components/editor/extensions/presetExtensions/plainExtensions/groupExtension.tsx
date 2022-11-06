import { PlainExtension } from '../..';

class GroupExtension extends PlainExtension {
	get name() {
		return 'group' as const;
	}

	onEditorStoreCreate?(): void {}
}

export default GroupExtension;
