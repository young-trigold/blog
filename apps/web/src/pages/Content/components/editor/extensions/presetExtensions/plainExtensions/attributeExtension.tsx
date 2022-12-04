import { extensionName } from '../../decorators/extensionName';
import { PlainExtension } from '../../type';

@extensionName('attribute')
class AttributeExtension extends PlainExtension {}

export default AttributeExtension;
