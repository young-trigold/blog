import { extensionName } from '../../decorators/extensionName';
import { PlainExtension } from '../../type';

@extensionName('command')
class CommandExtension extends PlainExtension {}

export default CommandExtension;
