import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
import { sdk } from '@farcaster/miniapp-sdk'; // <-- TAMBAHKAN BARIS INI

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

sdk.actions.ready(); // <-- TAMBAHKAN BARIS INI
