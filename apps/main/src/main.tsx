import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@pacepard/ui/styles/globals.css';
import './index.css'
import App from './App'
import { QueryProvider } from '@pacepard/tooling';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryProvider>
      <App />
    </QueryProvider>
  </StrictMode>,
)
