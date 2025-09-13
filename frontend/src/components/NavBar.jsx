import React, { useContext } from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { AppContent } from '../context/AppContext';
import { toast } from 'react-toastify'
import axios from 'axios'

const NavBar = () => {

  const navigate = useNavigate();
  const {userData,backendUrl, setUserData, setIsLoggedin } = useContext(AppContent);

  const logout = async () => {
    try{
      axios.defaults.withCredentials = true;
      const { data } = await axios.post(backendUrl + '/api/auth/logout')
      data.success && setIsLoggedin(false)
      data.success && setUserData(false)
      navigate('/')
    } catch(error){
      toast.error(error.message)
    }
  }

  const sendVerificationOtp = async () => {
    try{
       axios.defaults.withCredentials = true;
       const { data } = await axios.post(backendUrl + '/api/auth/send-verify-otp')

       if(data.success){
         navigate('/email-verify')
         toast.success(data.message)
       }else{
        toast.error(data.message)
       }

    } catch(error){
      toast.error(error.message)
    }
  }

  return (
    <div className='bg-slate-900 w-full flex justify-between sm:py-3 sm:px-5 items-center absolute top-0'>

       <div className='flex items-center'>
        {/* <img src={assets.logo} alt="" className='w-25 sm:w-20' /><span className=' text-gray-800 font-semibold text-3xl sm:text-4xl pt-3'>Student_Registration</span> */}
    
       <p className='text-white font-semibold text-3xl sm:text-2xl mx-5'>P.K Arts College</p>
        </div>

        { userData ? 
        <div className='w-11 h-11 mx-5 flex justify-center items-center rounded-full bg-white text-slate-900 relative group'>
         {userData.name[0].toUpperCase()}
         <div className='absolute hidden group-hover:block top-0 right-0 z-19 text-black rounded pt-10'>
            <ul className='list-none m-1 py-2 px-2 bg-gray-100 text-sm'>
              {/* {!userData.isAccountVerified && 
              <li onClick={sendVerificationOtp} className='py-1 px-2 hover:bg-gray-200 cursor-pointer font-semibold'>Verify email</li> 
              } */}
              <li onClick={logout} className='py-1 px-2 hover:bg-gray-200 cursor-pointer pr-10 font-semibold'>Logout</li>
            </ul>
          </div>
        </div> : 
        <button 
        onClick={() => navigate('/login')}
        className='flex items-center gap-2 border border-gray-500 rounded-full px-6 py-2 text-slate-900 bg-white hover:bg-gray-100 transition-all cursor-pointer'>Login <img src={assets.arrow_icon} alt='' /></button>
        }


    </div>
  )
}

export default NavBar