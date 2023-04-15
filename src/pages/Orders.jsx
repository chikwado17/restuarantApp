import React, {useState, useEffect} from 'react'
import { useParams } from 'react-router-dom';
import { collection, query, where, onSnapshot, orderBy } from "firebase/firestore"; 
import { db } from '../firebase'
import moment from 'moment';
import Currency from 'react-currency-formatter';

const Orders = () => {

    const [orders, setOrders] = useState([]);

    const { id } = useParams();


    useEffect(() => {


        const orderRef = collection(db, `orders`);

        const orderQuery = query(orderRef, where('userId', '==', id), orderBy("created", "desc"));
            const unsubscribe = onSnapshot(orderQuery, (querySnapshot) => {
                
            const orders = [];

                querySnapshot.forEach((doc) => {
                    orders.push({ ...doc.data() });
                });
    
                setOrders(orders);
            
            });
    
            return () => {
                unsubscribe();
            };
    
      }, [id]);

  return (
    <div className='mt-20'>
        <h1 className='text-3xl border-b mb-2 pb-1 border-yellow-400'>Your Orders</h1>
        <h2>{orders?.length} Orders</h2>

        {orders?.map(order => (

            <div key={order.intentId} className='relative border rounded-md bg-white shadow-lg mb-5'>
                <div className='flex items-center space-x-10 p-5 bg-gray-100 text-sm text-gray-600'>
                    <div>
                        <p className='font-bold text-xs'>ORDER PLACED</p>
                        <p>{moment.unix(order.created).format("DD MMM YYYY")}</p>
                    </div>

                    <div>
                        <p className='font-bold text-xs'>TOTAL</p>
                        <p>
                        Total Amount + &#8358;50 for Delivery{" "} <Currency quantity={parseInt(order.total)} currency='NGN' /> 
                    </p>
                </div>

                <div>
                    <p className='font-bold text-xs'>STATUS</p>
                    <p className='font-bold text-xs text-green-500'>{order.status}</p>
                </div>

                <p className='text-sm whitespace-nowrap absolute top-30 sm:top-10 right-5 sm:text-xl self-end flex-1 text-right text-blue-500'>{order.items.length} items</p>

                <p className='absolute top-2 right-2 w-40 lg:w-72 truncate text-sx whitespace-nowrap'>Order # {order.intentId}</p>
            </div>

            <div className='p-5 sm:p-10'>
                <div className='flex space-x-6 overflow-x-auto'>
                    {order.items?.map((item => (
                        <div key={item.id}>
                            <img className='h-20 object-contain sm:h-15' src={item.shorten} alt="" />
                            
                            <div className='mt-5'>
                                <p className='font-bold text-xs text-gray-500'>{item.title}</p>
                                <p className='font-bold text-xs text-gray-500'>Quantity {item.qty}</p>
                                <p className='font-bold text-xs text-gray-500'>Amount  &#8358;{item.TotalProductPrice}</p>
                                <p className='font-bold text-xs text-gray-500'>Total Amount  &#8358;{item.price}</p>
                            </div>
                        </div>
                    )))}
                </div>
            </div>
        </div>

        ))}    
    </div>
  )
}

export default Orders