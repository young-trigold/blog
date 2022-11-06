import { PlainExtension } from '../..';

class NodeViewExtension extends PlainExtension {
	get name() {
		return 'nodeView' as const;
	}

	onEditorStoreCreate?(): void {}
}

export default NodeViewExtension;
