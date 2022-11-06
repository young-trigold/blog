import { NodeSpec } from 'prosemirror-model';
import { NodeExtension } from '../..';

class TextExtension extends NodeExtension {
	get name() {
		return 'text' as const;
	}

	createNodeSpec(): NodeSpec {
		throw new Error('Method not implemented.');
	}
}

export default TextExtension;
