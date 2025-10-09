import React from 'react'
import { Routes, Route} from 'react-router-dom'
import Home from './pages/Home'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ViewData from './pages/ViewData'
import PrintData from './pages/PrintData'
import TotalCalc from './pages/TotalCalc'
import ContentDatas from './pages/ContentDatas'
import ViewSingleStudent from './pages/ViewSingleStudent'
import UpdateStudentData from './pages/UpdateStudentData'
import YearCategory from './pages/YearCategory'
import UserProfile from './pages/UserProfile';
import Login from './pages/Login';

const App = () => {
  return (
    <div>
      <ToastContainer/>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/content' element={<ContentDatas/>}/>
        <Route path='/view' element={<ViewData/>}/>
        <Route path='/print' element={<PrintData/>}/>
        <Route path='/total' element={<TotalCalc/>}/>
        <Route path='/profile' element={<UserProfile/>}/>
        <Route path='/student/:student_uid' element={<ViewSingleStudent/>}/>
        <Route path='/student/edit/:student_uid' element={<UpdateStudentData/>}/>
        <Route path='/total/:year' element={<YearCategory/>}/>
      </Routes>
    </div>
  )
}

export default App