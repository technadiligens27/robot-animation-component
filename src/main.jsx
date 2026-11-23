import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AnimationContextProvider } from './Context/AnimationContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AnimationContextProvider>
      <App />
    </AnimationContextProvider>
  </StrictMode>,
)
