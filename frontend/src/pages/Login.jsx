import { useContext, useState } from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { AppContent } from '../context/AppContext';
import axios from 'axios'
import { toast } from 'react-toastify'

const Login = () => {
 
 const navigate = useNavigate();

 const { backendUrl, setIsLoggedin, getUserData } = useContext(AppContent);


 const [state, setState] = useState('Sign Up')
 const [name, setName] = useState('')
 const [email, setEmail] = useState('')
 const [password, setPassword] = useState('')

 const onSubmitHandler = async (e) => {
  try{
    e.preventDefault();

    axios.defaults.withCredentials = true;

    if(state === 'Sign Up'){
      const {data} = await axios.post(backendUrl + '/api/auth/register',{name,email,password})

      if(data.success){
        setIsLoggedin(true)
        getUserData()
        navigate('/')
      }else{
        toast.error(data.message)
      }

    }else{
         const {data} = await axios.post(backendUrl + '/api/auth/login',{email,password})

      if(data.success){
        setIsLoggedin(true)
        getUserData()
        navigate('/')
      }else{
        toast.error(data.message)
      }
    }
  }catch(error){
    toast.error(error.message)
  }
 }

  return (
    <div className='flex items-center justify-center min-h-screen bg-gray-100 px-6 sm:px-0 '>

<div onClick={() => navigate('/')} className='cursor-pointer flex absolute top-3 sm:left-5 left-3'>
      <img  src={assets.logo} alt='' className='w-22 sm:w-25 ' />
      <span className='text-gray-800 font-semibold sm:text-4xl text-3xl sm:pt-8 pt-7'>MernAuth</span>
      </div>
       
      <div className='bg-slate-900 p-10 rounded-lg shadow-lg w-full sm:w-96 text-indigo-300 text-sm'>
        <h2 className='text-3xl font-semibold text-white text-center mb-3'>{state === 'Sign Up' ? 'Create account' : 'Login'}</h2>
        <p className='text-sm mb-6 text-center'>{state === 'Sign Up' ? 'Create your account' : 'Login to your account!'}</p>
        <form onSubmit={onSubmitHandler}>
          {state === 'Sign Up' && (
             <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
            <img src={assets.person_icon} alt="" />
            <input className='bg-transparent outline-none placeholder-gray-300' 
            onChange={(e) => setName(e.target.value)} value={name} 
            type="text" 
            placeholder='Full Name' required />
            </div>
          )}
         

            <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
            <img src={assets.mail_icon} alt="" />
            <input className='bg-transparent outline-none placeholder-gray-300' type="email" 
            onChange={(e) => setEmail(e.target.value)}
            value={email} 
            placeholder='Email id' required />
            </div>

            <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
            <img src={assets.lock_icon} alt="" />
            <input className='bg-transparent outline-none placeholder-gray-300' type="password" 
            onChange={(e) => setPassword(e.target.value)} 
            value={password} placeholder='Password' required />
            </div>

            <p onClick={() => navigate('/reset-password')} className='mb-4 text-indigo-500 cursor-pointer'>Forgot Password ?</p>

            <button className='w-full py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-900 text-white font-medium cursor-pointer'>{state}</button>
        </form>

        {state === 'Sign Up' ? (
          <p className='text-gray-400 text-center text-sm mt-4'>Already have a account?{'  '}
          <span onClick={() => setState('Login')} className='text-blue-400 cursor-pointer underline'>Login here</span>
        </p>
        ) : (
           <p className='text-gray-400 text-center text-sm mt-4'>Don't have an account?{'  '}
          <span onClick={() => setState('Sign Up')} className='text-blue-400 cursor-pointer underline'>Sign Up</span>
        </p>
        )}
        

       

      </div>
    </div>
  )
}

export default Login