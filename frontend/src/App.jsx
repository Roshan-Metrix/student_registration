import React from 'react'
import { Routes, Route} from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import EmailVerify from './pages/EmailVerify'
import ResetPassword from './pages/ResetPassword'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ContentData from './pages/contentData'
import ViewData from './pages/ViewData'
import PrintData from './pages/PrintData'
import TotalCalc from './pages/TotalCalc'
import Setting from './pages/Setting'

const App = () => {
  return (
    <div>
      <ToastContainer/>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/email-verify' element={<EmailVerify/>}/>
        <Route path='/reset-password' element={<ResetPassword/>}/>
        <Route path='/content' element={<ContentData/>}/>
        <Route path='/view' element={<ViewData/>}/>
        <Route path='/print' element={<PrintData/>}/>
        <Route path='/total' element={<TotalCalc/>}/>
        <Route path='/setting' element={<Setting/>}/>
      </Routes>
    </div>
  )
}

export default App