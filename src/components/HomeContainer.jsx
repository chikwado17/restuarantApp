import React from 'react'
import delivery from '../img/delivery.png'
import heroBg from '../img/heroBg.png'
import i1 from '../img/i1.png'
import i2 from '../img/f1.png'
import i3 from '../img/c3.png'
import i4 from '../img/fi1.png'


const heroData = [
    {id:1, name: 'Icecream', decp:'Chocolate & vanilla', price: '2,500', imageSrc: i1},
    {id:2, name: 'Strawberries', decp:'Fresh Strawberries', price: '500', imageSrc: i2},
    {id:3, name: 'Chicken Kebab', decp:'Mixed kabab Plate', price: '3,000', imageSrc: i3},
    {id:4, name: 'Fish', decp:'Mixed with Fish', price: '1,500', imageSrc: i4}

]




const HomeContainer = () => {
  return (
    <section id='home' className='grid grid-cols-1 md:grid-cols-2 gap-2 w-full lg:h-[90vh]'>
        <div className='py-2 flex-1 flex flex-col items-start justify-center gap-6'>
            <div className='flex items-center gap-2 bg-orange-100 justify-center rounded-full py-1 px-4'>
                <p className='text-base text-orange-500 font-semibold'>Bike Delivery</p>
                <div className='w-8 h-8 rounded-full overflow-hidden drop-shadow-xl'>
                    <img className='w-full h-full object-contain bg-white' src={delivery} alt="delivery" />
                </div>
            </div>

            <p className='text-[2.5rem] lg:text-[4.5rem] font-bold tracking-wide text-headingColor'>The Fastest Delivery in <span className='text-orange-600 text-[3rem] lg:text-[5rem]'>Your City</span></p>

            <p className='text-base text-textColor text-center md:text-left md:w-[80%]'>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Dolorum reiciendis pariatur minima blanditiis excepturi deleniti similique maxime? Sequi eaque nam, consequatur autem natus quaerat illo? Nulla neque aspernatur iusto fuga.</p>
        
            <button type='button' className='bg-gradient-to-br from-orange-400 to-orange-400 w-full md:w-auto py-2 transition-all ease-in ease-out duration-100 hover:shadow-lg rounded-lg px-4'>Order Now!</button>
        </div>
        <div className='flex-1 py-2 flex items-center relative'>
            <img src={heroBg} className="h-400 w-full lg:w-auto lg:h-650 ml-auto" alt="" />

            <div className='w-full h-full absolute top-0 left-0 flex items-center justify-center gap-4 flex-wrap lg:px-32 py-4 drop-shadow-lg'>

                {heroData && heroData.map(item => (
                    <div key={item.id} className='lg:w-190 p-4 bg-cardOverlay backdrop-blur-md rounded-3xl flex flex-col items-center justify-center'>
                        <img src={item.imageSrc} className="w-20 lg:w-40 -mt-10 lg:-mt-20" alt="" />
                        <p className='text-base lg:text-xl font-semibold text-textColor mt-2 lg:mt-4'>{item.name}</p>
                        <p className='text-[12px] lg:text-sm text-lighttextGray font-semibold my-1 lg:my-3'>{item.decp}</p>
                        <p className='text-sm font-semibold text-headingColor'>
                            <span className='text-xs text-red-600'>&#x20A6; </span>{item.price}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    </section>
  )
}

export default HomeContainer