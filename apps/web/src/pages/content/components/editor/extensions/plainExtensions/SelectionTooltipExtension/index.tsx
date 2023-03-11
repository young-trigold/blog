import { Plugin, PluginKey } from 'prosemirror-state';
import { extensionName } from '../../decorators/extensionName';
import { PlainExtension } from '../../type';

@extensionName('selection_tooltip')
export class SelectionTooltipExtension extends PlainExtension {
  pluginKey = new PluginKey('selection_tooltip');

  createPlugins(): Plugin<any>[] {
    return [
      new Plugin({
        key: this.pluginKey,
        props: {
          handleDOMEvents: {
            mousedown: (editorView) => {
              const { state } = editorView;
              const { tr } = state;
              editorView.dispatch(tr.setMeta(this.pluginKey, { selectionTooltipVisible: true }));
            },
            mouseup: (editorView) => {
              const { state } = editorView;
              const { tr } = state;
              editorView.dispatch(tr.setMeta(this.pluginKey, { selectionTooltipVisible: true }));
            },
          },
        },
      }),
    ];
  }
}
