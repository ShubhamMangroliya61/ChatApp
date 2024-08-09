import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './redux/Store';
import { Toaster } from 'react-hot-toast';
import { GoogleOAuthProvider } from '@react-oauth/google';

// Ensure you are using `HTMLElement` as the type for the root element
const rootElement = document.getElementById('root');

ReactDOM.createRoot(rootElement).render(

  <GoogleOAuthProvider clientId='238269720053-m1oe5ur5f36cg5q4tnuoqth4qju3dmpj.apps.googleusercontent.com'>
    <Provider store={store}>
      <BrowserRouter>
        <App />
        <Toaster
          position="top-right"
          reverseOrder={false}
          toastOptions={{
            style: {
              borderRadius: '10px',
              background: '#333',
              color: '#fff',
            },
            iconTheme: {
              primary: '#6a5103',
              secondary: '#ffd308',
            },
          }}
        />
      </BrowserRouter>
    </Provider>
  </GoogleOAuthProvider>
);
