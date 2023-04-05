import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import StateContextProvider  from './context/StateContext';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <AnimatePresence mode='wait'>
        <StateContextProvider>
        <ToastContainer
        position='top-right'
        theme='dark'
        />
          <App />
        </StateContextProvider>
      </AnimatePresence>
    </BrowserRouter>
  </React.StrictMode>
);

