import React, { useState } from 'react'
import { IoFastFood } from 'react-icons/io5';
import { categories } from '../utils/Categories';
import { motion } from 'framer-motion';
import { useStateValue } from '../context/StateContext';
import RowContainer from './RowContainer';

const MenuContainer = () => {

    const [filter, setFilter] = useState('rice');

    const {foodItems} = useStateValue();

  return (
        <section className='w-full my-6' id='menu'>
            <div className='w-full flex flex-col items-center justify-center'>
                <p className='text-2xl font-semibold capitalize text-headingColor relative before:absolute before:rounded-lg before:content before:w-32 before:h-1 before:-bottom-2 before:left-12 before:bg-orange-500 transition-all ease-in-out duration-100'>
                    Our Hot Dishes
                </p>

           
                <div className='w-full flex items-center justify-start lg:justify-center gap-8 py-6 mt-8 overflow-x-scroll scrollbar-none'>
                {categories && categories.map(category => (
                    <motion.div whileTap={{scale: 0.75}} key={category.id} onClick={() => setFilter(category.urlParamName)} className={`group ${filter === category.urlParamName ? 'bg-cartNumBg' : 'bg-card'} w-24 min-w-[94px] h-28 cursor-pointer rounded-lg drop-shadow-xl flex flex-col gap-3 items-center justify-center hover:bg-red-600 `}>
                        <div className={`w-10 h-10 rounded-full shadow-lg ${filter === category.urlParamName ? 'bg-white' : 'bg-cartNumBg'} group-hover:bg-white flex items-center justify-center`}>
                            <IoFastFood className={`${filter === category.urlParamName ? 'text-textColor' : 'text-white'} group-hover:text-textColor text-lg`} />
                        </div>
                        <p className={`text-sm ${filter === category.urlParamName ? 'text-white' : 'text-textColor'} group-hover:text-white`}>{category?.name}</p>
                    </motion.div> 
                ))}
                </div>
           

                <div className='w-full'>
                    <RowContainer flag={false} data={foodItems?.filter(n => n?.category === filter)} />
                </div>
            </div>
        </section>
  )
}

export default MenuContainer