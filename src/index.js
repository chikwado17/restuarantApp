import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import StateContextProvider  from './context/StateContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <AnimatePresence mode='wait'>
        <StateContextProvider>
          <App />
        </StateContextProvider>
      </AnimatePresence>
    </BrowserRouter>
  </React.StrictMode>
);

