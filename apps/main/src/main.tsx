import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@pacepard/ui/styles/globals.css';
import App from './App'
import { QueryProvider } from '@pacepard/sdk';
// Initialize SDK - this sets up the global instance for hooks
import './config/pacepard';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryProvider>
      <App />
    </QueryProvider>
  </StrictMode>,
)
