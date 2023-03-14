import React from 'react';
import { MdShoppingBasket, MdAdd, MdLogout } from 'react-icons/md';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Logo from '../img/logo.png';
import Avatar from '../img/avatar.png';
import { useStateValue } from '../context/StateContext';
import { useState } from 'react';



const Header = () => {

  const { login, user, loading, isMenu, logout} = useStateValue();


  return (
    <header className='fixed z-50 w-screen p-3 px-4 md:p-6 md:px-16'>
        {/* {desktop & tablet} */}
        <div className='hidden md:flex w-full h-full items-center justify-between'>
            <Link to={'/'} className='flex items-center gap-2'>
                <img src={Logo} className="w-8 object-cover" alt="" />
                <p className="text-headingColor text-xl font-bold"> City </p>
            </Link>


          <div className='flex items-center gap-8'>
                <ul className='flex items-center gap-8'>
                    <motion.li whileTap={{scale:0.6}} className='text-base text-textColor hover:text-headingColor duration-100 transition-all ease-in-out cursor-pointer'>Home</motion.li>
                    <motion.li whileTap={{scale:0.6}} className='text-base text-textColor hover:text-headingColor duration-100 transition-all ease-in-out cursor-pointer'>Menu</motion.li>
                    <motion.li whileTap={{scale:0.6}} className='text-base text-textColor hover:text-headingColor duration-100 transition-all ease-in-out cursor-pointer'>About Us</motion.li>
                    <motion.li whileTap={{scale:0.6}} className='text-base text-textColor hover:text-headingColor duration-100 transition-all ease-in-out cursor-pointer'>Services</motion.li>
                </ul>

                <motion.div whileTap={{scale:0.6}} className="relative flex items-center justify-center">
                    <MdShoppingBasket className='text-textColor text-2xl cursor-pointer' />
                    <div className='w-5 h-5 absolute -top-2 -right-2 rounded-full bg-cartNumBg flex items-center justify-center'>
                        <p className="text-sm text-white font-semibold">2</p>
                    </div>
                </motion.div>


            {!loading &&
              <div className='relative'>
              
              <motion.img whileTap={{scale:0.6}} onClick={login} src={user ? user?.photoURL : Avatar}  alt="userProfile" className='rounded-full w-10 min-w-[40px] min-h-[40px] drop-shadow-xl cursor-pointer' />
          
               {isMenu && (
                  <motion.div 
                    initial={{opacity: 0, scale: 0.6}}
                    animate={{opacity: 1, scale: 1}}
                    exit={{opacity: 0, scale: 0.5}}

                    className='w-40 bg-gray-50 shadow-xl rounded-lg flex flex-col absolute top-12 right-0'>
                    {user && user.email === 'chikwadonworie@gmail.com' && (
                        <Link to={'/createItem'}>
                              <p className='px-4 py-2 flex items-center gap-3 cursor-pointer hover:bg-slate-100 transition-all duration-100 ease-out text-textColor text-base'>New Item <MdAdd/></p>
                        </Link>
                    ) }
                    <p onClick={logout} className='px-4 py-2 flex items-center gap-3 cursor-pointer hover:bg-slate-100 transition-all duration-100 ease-out text-textColor text-base'>Logout <MdLogout /></p>
                  </motion.div>
               )}
            </div>}
         
          </div>
        </div>


        {/* {mobile} */}
        <div className='flex items-center justify-between md:hidden w-full h-full'>
            <Link to={'/'} className='flex items-center gap-2'>
                <img src={Logo} className="w-8 object-cover" alt="" />
                <p className="text-headingColor text-xl font-bold"> City </p>
            </Link>



            {!loading &&
              <div className='relative'>
              
              <motion.img whileTap={{scale:0.6}} onClick={login} src={user ? user?.photoURL : Avatar}  alt="userProfile" className='rounded-full w-10 min-w-[40px] min-h-[40px] drop-shadow-xl cursor-pointer' />
          
               {isMenu && (
                  <motion.div 
                        initial={{opacity: 0, scale: 0.6}}
                        animate={{opacity: 1, scale: 1}}
                        exit={{opacity: 0, scale: 0.5}}

                        className='w-40 bg-gray-50 shadow-xl rounded-lg flex flex-col absolute top-12 right-0'>
                        {user && user.email === 'chikwadonworie@gmail.com' && (
                            <Link to={'/createItem'}>
                                  <p className='px-4 py-2 flex items-center gap-3 cursor-pointer hover:bg-slate-100 transition-all duration-100 ease-out text-textColor text-base'>New Item <MdAdd/></p>
                            </Link>
                        ) }

                        <ul className='flex flex-col'>
                            <li className='hover:bg-slate-100 px-4 py-2 text-base text-textColor hover:text-headingColor duration-100 transition-all ease-in-out cursor-pointer'>Home</li>
                            <li className='hover:bg-slate-100 px-4 py-2 text-base text-textColor hover:text-headingColor duration-100 transition-all ease-in-out cursor-pointer'>Menu</li>
                            <li className='hover:bg-slate-100 px-4 py-2 text-base text-textColor hover:text-headingColor duration-100 transition-all ease-in-out cursor-pointer'>About Us</li>
                            <li className='hover:bg-slate-100 px-4 py-2 text-base text-textColor hover:text-headingColor duration-100 transition-all ease-in-out cursor-pointer'>Services</li>
                        </ul>
                        <p onClick={logout} className='m-2 p-2 flex items-center justify-center bg-red-700 rounded-md shadow-lg text-cyan-50 gap-3 cursor-pointer hover:bg-red-800 transition-all duration-100 ease-out text-base'>Logout <MdLogout /></p>
                  </motion.div>
               )}
            </div>}
        </div>


    </header>
  ) 
  
}

export default Header