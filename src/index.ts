import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import SnailyMediaReader from './SnailyMediaReader';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <SnailyMediaReader />
  </React.StrictMode>
);
