import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
//import './index.css'
import App from './App.jsx'
import { Provider } from 'react-redux'
import store from './redux/store.js'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>

  <Provider store={store}>
             <App />
         </Provider>

  </BrowserRouter>,
)
