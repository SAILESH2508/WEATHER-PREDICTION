import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'bootstrap/dist/css/bootstrap.min.css'
import './index.css'
import App from './App.jsx'

// TEST - Check if CSS is loading
console.log('🎨 CSS should be loading now...', new Date().toLocaleTimeString())
console.log('🔍 Check for red border around container')
console.log('🚀 React is definitely running if you see this message')

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
