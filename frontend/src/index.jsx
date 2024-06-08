import React from 'react'
import ReactDOM from 'react-dom/client'
import './assets/css/styles.css'
import createStore from 'react-auth-kit/createStore'
import AuthProvider from 'react-auth-kit'
import { BrowserRouter, Routes } from 'react-router-dom'
import PublicRoutes from './routes/PublicRoutes'
import AdminRoutes from './routes/AdminRoutes'
import { ToastContainer } from 'react-toastify'
import { ThemeProvider } from './providers/ThemeProvider'
import './assets/css/styles.css'

const store = createStore({
  authName: '_auth',
  authType: 'cookie',
  cookieDomain: window.location.hostname,
  cookieSecure: false
})

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <AuthProvider store={store}>
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          {PublicRoutes()}

          {AdminRoutes()}
        </Routes>
        {/* Toast Configuration */}
        <ToastContainer
          position='bottom-right'
          autoClose={4000}
          limit={5}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          // theme={isDarkMode ? 'dark' : 'light'}
          stacked
        />
      </BrowserRouter>
    </ThemeProvider>
  </AuthProvider>
)
