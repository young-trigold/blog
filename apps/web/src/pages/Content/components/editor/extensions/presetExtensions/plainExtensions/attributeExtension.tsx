import { PlainExtension } from '../..';

class AttributeExtension extends PlainExtension {
	get name() {
		return 'attribute' as const;
	}
}

export default AttributeExtension;
