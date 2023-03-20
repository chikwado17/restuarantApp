import React, { useEffect, useRef } from 'react'
import { MdShoppingBasket } from 'react-icons/md'
import { motion } from 'framer-motion'
import NotFound  from '../img/NotFound.svg';

const RowContainer = ({flag,data, scrollValue}) => {

    
    const rowContainer = useRef();

    useEffect(() => {

       rowContainer.current.scrollLeft += scrollValue;

    },[scrollValue]);

  return (
    <div ref={rowContainer} className={`w-full my-12 scroll-smooth flex items-center gap-3 ${flag ? 'overflow-x-scroll scrollbar-none' : 'overflow-x-hidden flex-wrap justify-center'}`}>
        
        
        {data && data.length > 0 ? data.map(item => (
            <div key={item.id} className='w-300 h-[225px] min-w-[300px] md:w-340 md:min-w-[340px] hover:drop-shadow-lg bg-cardOverlay rounded-lg p-2  backdrop-blur-lg my-12 flex flex-col items-center justify-between'>
                <div className="w-full flex items-center justify-between">
                    <motion.div
                    whileHover={{scale:1.2}}
                    className='w-40 -mt-8 h-40 drop-shadow-2xl'
                    >
                        <img  src={item.imageURL} className="w-full h-full object-contain" alt="" />
                    </motion.div>
                
                    <motion.div
                        whileTap={{scale:0.90}}

                    className='w-8 h-8 rounded-full bg-red-600 flex items-center justify-center cursor-pointer hover:shadow-md'>
                        <MdShoppingBasket className='text-white' />
                    </motion.div>
                
                </div>

                <div className='w-full flex flex-col items-end justify-end'>
                    <p className='text-textColor font-semibold text-base md:text-lg'>
                       {item?.title}
                    </p>
                    <p className='mt-1 text-sm text-gray-500'>{item?.calories} Calories</p>
                    <div className='flex items-center gap-8'>
                        <p className='text-lg text-headingColor font-semibold'><span className='text-sm text-red-500'>Price &#x20A6; </span>{item?.price}</p>
                    
                    
                    </div>
                </div>
            </div>
        )) : (
            <div className='w-full flex flex-col items-center justify-center'>
                <img src={NotFound} className="h-340" alt="" />
                <p className='text-xl my-5 text-headingColor font-semibold'>Item Not Available</p>
            </div>
        )}
    </div>
  )
}

export default RowContainer