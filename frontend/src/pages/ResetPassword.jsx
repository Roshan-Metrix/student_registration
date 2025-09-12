import React, { useContext, useState } from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { AppContent } from '../context/AppContext'
import axios from 'axios'
import {toast} from 'react-toastify'

const ResetPassword = () => {

  const { backendUrl } = useContext(AppContent);
  axios.defaults.withCredentials = true;

  const navigate = useNavigate();
  const [email,setEmail] = useState('')
  const [newPassword,setNewPassword] = useState('')
  const [isEmailSent, setIsEmailSent] = useState('')
  const [otp, setOtp] = useState(0)
  const [isOtpSubmitted, setIsOtpSubmitted] = useState(false)
  
  // handling input otp 
    const inputRefs = React.useRef([])
  
    const handleInput = (e, index) => {
      if(e.target.value.length > 0 && index < inputRefs.current.length - 1){
        inputRefs.current[index + 1].focus();
      }
    }
  
  const handleKeyDown = (e, index) => {
    if(e.key === 'Backspace' && e.target.value === '' && index > 0){
      inputRefs.current[index - 1].focus();
    }
  }
    
  const handlePaste = (e) => {
    const paste = e.clipboardData.getData('text')
    const pasteArray = paste.split('');
    pasteArray.forEach((char, index) => {
     if(inputRefs.current[index]){
      inputRefs.current[index].value = char;
     }
    })
  }
  

const onSubmitEmail = async (e) => {
  e.preventDefault();
    try{
     const {data} = await axios.post(backendUrl + '/api/auth/send-reset-otp',{email})
     data.success ? toast.success(data.message) : toast.error(data.message)
     data.success && setIsEmailSent(true)
    }catch(error){
      toast.error(error.message)
    }
}

const onSubmitOTP = async (e)=>{
   e.preventDefault();
        const otpArray = inputRefs.current.map(e => e.value)
       setOtp(otpArray.join(''))
     setIsOtpSubmitted(true)
}

const onSubmitNewPassword = async (e) => {
  e.preventDefault();
  try{
    const {data} = await axios.post(backendUrl + '/api/auth/reset-password',{email,otp,newPassword})
    data.success ? toast.success(data.message) : toast.error(data.message)
    data.success && navigate('/login')
  } catch(error){
    toast.error(error.message)
  }
}

  return (
       <div className="flex items-center justify-center min-h-screen bg-gray-100">
  <div onClick={() => navigate('/')} className='cursor-pointer flex absolute top-3 sm:left-5 left-3'>
      <img  src={assets.logo} alt='' className='w-24 sm:w-30 ' />
      <span className='text-gray-800 font-semibold sm:text-5xl text-4xl sm:pt-11 pt-7'>MernAuth</span>
      </div>

{/* Enter email id */}
{!isEmailSent && 
     <div className="max-w-md w-full rounded-2xl shadow-lg p-8 text-center bg-slate-900">
        <h2 className="text-3xl font-bold mb-3 text-gray-200">Reset Password</h2>
        <p className="text-gray-400 mb-7">Enter the registered email address</p>

        <form onSubmit={onSubmitEmail} className="flex flex-col items-center">
          <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
            <img src={assets.mail_icon} alt="" className='w-4 h-4'/>
            <input type="email" placeholder='Email id' 
            value={email}
            onChange = {(e) => setEmail(e.target.value)}
            required
            className='bg-transparent outline-none text-white' />
          </div>
          <button 
          type="submit"
          className='bg-gradient-to-r from-blue-600 to-blue-400 text-white text-lg font-medium py-2.5 rounded-lg w-full shadow hover:from-blue-700 hover:to-blue-500 transition cursor-pointer'
          >Submit</button>
          </form>
          </div>
}

{/* For adding otp */}
{!isOtpSubmitted && isEmailSent && 
            <div className="max-w-md w-full rounded-2xl shadow-lg p-8 text-center bg-slate-900">
        <h2 className="text-3xl font-bold mb-3 text-gray-200">Reset Password OTP</h2>
        <p className="text-gray-400 mb-7">Enter the 6-digit OTP sent to your email</p>

        <form onSubmit={onSubmitOTP} className="flex flex-col items-center">
          <div className="flex gap-3 mb-6 justify-center" onPaste={handlePaste}>
            {Array(6).fill(0).map((_, index) => (
              <input   
              type="text"
                key={index}
                maxLength={1}
                pattern="[0-9]*"
                required
                ref={e => inputRefs.current[index] = e}
                onInput = {(e) => handleInput(e, index)}
                onKeyDown = {(e) => handleKeyDown(e, index)}
                className="w-12 h-14 text-2xl text-center border-2 border-gray-300 rounded-lg outline-none bg-gray-100 focus:border-blue-500 focus:bg-white transition"
              />
            ))}
          </div>
          <button
            type="submit"
            className="bg-gradient-to-r from-blue-600 to-blue-400 text-white text-lg font-medium py-2.5 rounded-lg w-full shadow hover:from-blue-700 hover:to-blue-500 transition cursor-pointer"
          >
            Submit
          </button>
        </form>
      </div>
}

  {/* Enter new password */}
{isOtpSubmitted && isEmailSent && 
       <div className="max-w-md w-full rounded-2xl shadow-lg p-8 text-center bg-slate-900">
        <h2 className="text-3xl font-bold mb-3 text-gray-200">New Password</h2>
        <p className="text-gray-400 mb-7">Enter the new password below</p>

        <form onSubmit={onSubmitNewPassword} className="flex flex-col items-center">
          <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
            <img src={assets.lock_icon} alt="" className='w-4 h-4'/>
            <input type="password" placeholder='Password' 
            value={newPassword}
            onChange = {(e) => setNewPassword(e.target.value)}
            required
            className='bg-transparent outline-none text-white' />
          </div>
          <button 
          type="submit"
          className='bg-gradient-to-r from-blue-600 to-blue-400 text-white text-lg font-medium py-2.5 rounded-lg w-full shadow hover:from-blue-700 hover:to-blue-500 transition cursor-pointer'
          >Submit</button>
          </form>
          </div>

}
       </div>
   
  )
}

export default ResetPassword