import React from 'react';
import ReactDOM from 'react-dom/client';
import { StyledEngineProvider } from '@mui/material/styles';
import { Provider as StoreProvider } from 'react-redux';

import reportWebVitals from './reportWebVitals';
import ThemeProvider from './providers/ThemeProvider';
import PreferencesProvider from './providers/PreferencesProvider';
import store from './store';
import App from './App';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import AuthProvider from './providers/AuthProvider';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <StyledEngineProvider injectFirst>
    <StoreProvider store={store}>
      <PreferencesProvider>
        <ThemeProvider>
          <AuthProvider>
            <BrowserRouter>
              <App />
            </BrowserRouter>
          </AuthProvider>
        </ThemeProvider>
      </PreferencesProvider>
    </StoreProvider>
  </StyledEngineProvider>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint.  Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
