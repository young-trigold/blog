import { history } from 'prosemirror-history';

import inputRulesPlugin from './inputRulesPlugin';
import keymapPlugin from './keymapPlugin';

const plugins = [history(), keymapPlugin, inputRulesPlugin];

export default plugins;
