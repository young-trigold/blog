import { NodeSpec } from 'prosemirror-model';
import { NodeExtension } from '..';

class TextExtension extends NodeExtension {
	createNodeSpec(): NodeSpec {
		throw new Error('Method not implemented.');
	}
	get name() {
		return 'text' as const;
	}
}

export default TextExtension;
