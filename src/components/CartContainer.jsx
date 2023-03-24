import React, { useEffect } from 'react'
import { MdOutlineKeyboardBackspace } from 'react-icons/md'
import { RiRefreshFill} from 'react-icons/ri'
import { BiMinus, BiPlus } from 'react-icons/bi'
import { motion } from 'framer-motion'
import img1 from '../img/emptyCart.svg';
import { useStateValue } from '../context/StateContext';




const CartContainer = () => {

    const { showCart, cart} = useStateValue();

   console.log(cart && cart?.id);   

  return (
    <motion.div 
    initial={{opacity: 0, x:200}}
    animate={{opacity: 1, x:0}}
    exit={{opacity: 0, x:200}}
    
    className='fixed z-[101] top-0 right-0 w-full md:w-375 h-screen bg-white drop-shadow-md flex flex-col'>
        <div className='w-full flex items-center justify-between p-4 cursor-pointer'>
            <motion.div whileTap={{scale:0.75}}>
                <MdOutlineKeyboardBackspace onClick={showCart} className='text-textColor text-3xl' />
            </motion.div>
            <p className='text-textColor text-lg font-semibold'>Cart</p>
            
            <motion.p whileTap={{scale:0.75}} className='flex items-center gap-2 p-1 px-2 my-2 bg-gray-100 rounded-md hover:shadow-md cursor-pointer text-textColor'>Clear 
            
                <RiRefreshFill /> {" "} </motion.p>
        </div>



{/* bottom section */}
       
       {cart && cart.length > 0 ? (
                    <div className='w-full h-full bg-cartBg rounded-t-[2rem] flex flex-col'>
                    {/* for the cart items */}
                    
                    <div className='w-full h-340 md:h-42 px-6 py-10 flex flex-col gap-3 overflow-y-scroll scrollbar-none'>
                        
                        
                        
                        {/* for the cart item */}
                        {cart && cart.length > 0 && cart.map(cartItem => (
                        
                            <div key={cartItem?.id} className='w-full p-1 px-2 rounded-lg bg-cartItem flex items-center gap-2'>
                                <img src={cartItem?.imageURL} alt={'item-img'} className="w-20 h-20 max-w-[60px] rounded-full object-contain" />

                                {/* name section */}
                                <div className='flex flex-col gap-2'>
                                    <p className='text-base text-gray-50'>{cartItem?.title}</p>
                                    <p className='text-sm block text-gray-300 font-semibold'>&#x20A6; {cartItem?.price}</p>
                                </div>

                                {/* button section */}
                                <div className='group flex items-center gap-2 ml-auto cursor-pointer'>
                                    <motion.div whileTap={{scale:0.75}}>
                                        <BiMinus className="text-gray-50" />
                                    </motion.div>

                                    <p className='w-5 h-5 rounded-sm bg-cartBg text-gray-50 flex items-center justify-center'>{cartItem?.qty}</p>

                                    <motion.div whileTap={{scale:0.75}}>
                                        <BiPlus className="text-gray-50" />
                                    </motion.div>
                                </div>
                            </div>
                        )) }

                        
                    </div>

                   
                    <div className='w-full flex-1 bg-cartTotal rounded-t-[2rem] flex flex-col items-center justify-evenly px-8 py-2'>
                        <div className='w-full flex items-center justify-between'>
                            <p className='text-gray-400 text-lg'>Sub Total</p>
                            <p className='text-gray-400 text-lg'>&#x20A6;8.5</p>
                        </div>

                        <div className='w-full flex items-center justify-between'>
                            <p className='text-gray-400 text-lg'>Delivery</p>
                            <p className='text-gray-400 text-lg'>&#x20A6;2.5</p>
                        </div>
                    
                        <div className='w-full border-b border-gray-600 my-2'></div>
                    

                    <div className='w-full flex items-center justify-between'>
                        <p className='text-gray-200 text-xl font-semibold'>Total</p>
                        <p className='text-gray-200 text-xl font-semibold'>&#x20A6;11.5</p>
                    </div>


                    <motion.button
                    whileTap={{scale:0.8}}
                    type="button"
                    className='w-full p-2 rounded-full bg-orange-400 text-gray-50 text-lg my-2 hover:shadow-lg'
                    >
                        Check Out
                    </motion.button>
                </div>
            </div>
       ): (
        <div className='w-full h-full flex flex-col items-center justify-center gap-6'>
            <img src={img1} className='w-300' alt="empty cart" />
            <p className='text-xl'>Add some items to your cart</p>
        </div>

       )}
    </motion.div>
  )
}

export default CartContainer