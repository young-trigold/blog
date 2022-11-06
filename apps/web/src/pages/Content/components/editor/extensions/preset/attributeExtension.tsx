import { PlainExtension } from '../extension';

class AttributeExtension extends PlainExtension {
	get name() {
		return 'attribute' as const;
	}
}

export default AttributeExtension;
