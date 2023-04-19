import { Plugin, PluginKey } from 'prosemirror-state';
import { extensionName } from '../../decorators/extensionName';
import { PlainExtension } from '../../type';

interface SelectionTooltipPluginState {
  onMouseDowned: boolean;
}

@extensionName('selection_tooltip')
export class SelectionTooltipExtension extends PlainExtension {
  pluginKey = new PluginKey<SelectionTooltipPluginState>('selection_tooltip');

  createPlugins(): Plugin<any>[] {
    return [
      new Plugin<SelectionTooltipPluginState>({
        key: this.pluginKey,
        state: {
          init() {
            return {
              onMouseDowned: false,
            };
          },
          apply: (tr, value) => {
           //console.debug(tr.getMeta(this.pluginKey)?.onMouseDowned ?? value.onMouseDowned);
            return {
              onMouseDowned: tr.getMeta(this.pluginKey)?.onMouseDowned ?? value.onMouseDowned,
            };
          },
        },
        props: {
          handleDOMEvents: {
            mousedown: (editorView) => {
              const { state } = editorView;
              const { tr } = state;
              // editorView.dispatch(tr.setMeta(this.pluginKey, { onMouseDowned: true }));
              editorView.updateState(
                editorView.state.apply(tr.setMeta(this.pluginKey, { onMouseDowned: true })),
              );
            },
            mouseup: (editorView) => {
              const { state } = editorView;
              const { tr } = state;
              // editorView.dispatch(tr.setMeta(this.pluginKey, { onMouseDowned: false }));
              editorView.updateState(
                editorView.state.apply(tr.setMeta(this.pluginKey, { onMouseDowned: false })),
              );
            },
          },
        },
      }),
    ];
  }
}
