import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './app';

// styles
import 'styles/base.scss'
import 'styles/fontStyles.css'

// render the app
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <App/>
)