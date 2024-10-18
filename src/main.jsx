import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import {

  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import Routes from './Routes.jsx'
const queryClient = new QueryClient()

createRoot(document.getElementById('root')).render(
  <QueryClientProvider client={queryClient}>
  <Routes/>
</QueryClientProvider>
)
