import React, { useContext } from 'react'
import { assets } from '../assets/assets'
import { AppContent } from '../context/AppContext'

const Header = () => {

  const { userData } = useContext(AppContent)

  return (
    <div className='flex flex-col items-center m-20 px-4 text-center text-grey-800'>
      <div className="bg-white w-70 h-66 rounded-full flex justify-center items-center mb-5 overflow-hidden shadow-2xl shadow-gray-200">
        <img src={assets.header_img} alt="" className='w-60 h-60 hover:-scale-x-100 transition duration-700 rounded-[80%]' />
        </div>
        <h1 className='flex items-center gap-2 text-xl sm:text-3xl font-medium mb-2'>Hey {userData ? userData.name : 'User'}!
          <img className='w-8 aspect-square' src={assets.hand_wave} alt='' />
        </h1>

        <h2 className='text-3xl sm:text-3xl  font-semibold mb-4'>Welcome To Student Registration </h2>

        <p className='mb-8 max-w-md'>Login and start managing your students effectively!</p>

        <button className='border border-grey-500 rounded-full px-8 py-2.5 hover:bg-gray-100 transition-all'>Get Started</button>
    </div>
  )
}

export default Header