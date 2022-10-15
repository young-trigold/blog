import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import App from './App';
import appStore from './app/appStore';

const root = document.createElement('div');

root.id = 'root';
root.style.position = 'relative';

document.body.appendChild(root);

ReactDOM.createRoot(root).render(
  <Provider store={appStore}>
    <App />
  </Provider>,
);
