import React from 'react'
import { NavLink } from 'react-router-dom'
import { assets } from '../assets/assets'

const Sidebar = () => {
  return (
    <div className='w-16 sm:w-20 md:w-[18%] min-h-screen border-r-2 bg-white'>
      
      <div className='flex flex-col gap-2 sm:gap-3 md:gap-4 pt-4 sm:pt-6 px-2 sm:px-3 md:pl-[20%] text-[13px] sm:text-[14px] md:text-[15px]'>
        
          <NavLink className='flex items-center justify-center md:justify-start gap-2 sm:gap-3 border border-gray-300 md:border-r-0 px-2 sm:px-3 md:px-3 py-2 rounded-lg md:rounded-l hover:bg-gray-100 transition-colors' to='/add'>
              <img className='w-5 h-5 flex-shrink-0' src={assets.add_icon} alt="Add" />
              <p className='hidden md:block text-gray-800 whitespace-nowrap'>Add Items</p>
          </NavLink>

          <NavLink className='flex items-center justify-center md:justify-start gap-2 sm:gap-3 border border-gray-300 md:border-r-0 px-2 sm:px-3 md:px-3 py-2 rounded-lg md:rounded-l hover:bg-gray-100 transition-colors' to='/list'>
              <img className='w-5 h-5 flex-shrink-0' src={assets.order_icon} alt="List" />
              <p className='hidden md:block whitespace-nowrap'>List Items</p>
          </NavLink>

          <NavLink className='flex items-center justify-center md:justify-start gap-2 sm:gap-3 border border-gray-300 md:border-r-0 px-2 sm:px-3 md:px-3 py-2 rounded-lg md:rounded-l hover:bg-gray-100 transition-colors' to='/order'>
              <img className='w-5 h-5 flex-shrink-0' src={assets.order_icon} alt="Orders" />
              <p className='hidden md:block whitespace-nowrap'>Order Items</p>
          </NavLink>

      </div>
    </div>
  )
}

export default Sidebar