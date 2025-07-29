import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {GoogleOAuthProvider} from '@react-oauth/google'

const CLIENT_ID = "1033447667626-80ks5tf3polk9q1j1kg1p4hs127smoll.apps.googleusercontent.com"

createRoot(document.getElementById('root')).render(
  <StrictMode>
     <GoogleOAuthProvider clientId={CLIENT_ID}>
    <App />
    </GoogleOAuthProvider>
  </StrictMode>,
)
