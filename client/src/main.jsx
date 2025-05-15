import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import App from './App.jsx';
import { store } from './app/store';
import './styles/global.css';
import { FavoritesProvider } from './context/FavoritesContext';
import { AuthProvider }      from './context/AuthContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <Provider store={store}>
        <FavoritesProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </FavoritesProvider>
      </Provider>
    </AuthProvider>
  </React.StrictMode>
);
