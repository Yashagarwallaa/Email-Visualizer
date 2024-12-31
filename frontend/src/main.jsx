import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {Route,RouterProvider} from 'react-router-dom';
import { createBrowserRouter,createRoutesFromElements } from 'react-router-dom';
import Register from './components/Register.jsx';
import Login from './components/Login.jsx';
import Home from './components/Home.jsx';
import Dashboard from './components/Dashboard.jsx';
 
const router = createBrowserRouter(
  createRoutesFromElements(
     <Route path = "/" element={<App/>}>
      <Route index element={<Home/>}/>
      <Route path = '/register' element={<Register/>}/>
      <Route path = '/login' element={<Login/>}/>
      <Route path = '/dashboard' element={<Dashboard/>}/>
     </Route>
  )
);

createRoot(document.getElementById('root')).render(
 
    <RouterProvider router={router}/>

)
