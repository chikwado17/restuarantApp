import React, { createContext, useContext, useReducer, useEffect, useState } from 'react';

import { getAuth, signInWithPopup, GoogleAuthProvider,onAuthStateChanged, signOut } from 'firebase/auth';
import { db } from '../firebase';
import { doc, setDoc, getDoc, getDocs, collection, query, updateDoc, where, onSnapshot } from "firebase/firestore"; 
import { app } from "../firebase";


import { FETCH_ITEMS, SET_CART_SHOW, SET_USER, SIGN_OUT } from './initialTypes';
import { initialState } from './initialState';
import  reducer  from './reducer';
import { toast } from 'react-toastify';





const StateContext = createContext();

const StateContextProvider = ({children}) => {
    const [loading, setLoading] = useState(true);
    const [isMenu, setIsMenu] = useState(false);
    const [uid, setUid] = useState(null);
    const [userCart, setUserCart] = useState([]);


    const auth = getAuth(app);


    const [state, dispatch] = useReducer(reducer, initialState );

    const provider = new GoogleAuthProvider();


    //function to handle google login authentication by popup
    const login = async () => {

        if(!state.user) {
            try {

                const response = await signInWithPopup(auth, provider);
    
                const user = response.user;

           
    
                // // //getting user doc reference
                const docRef = doc(db, 'users', user.uid);
                const docSnap = await getDoc(docRef);
                //     //check if user doesn't exit create user and save to database
                if(!docSnap.exists()){
                    //create user in database
                    await setDoc(doc(db, 'users', user.uid), {
                        userId: response.user.uid,
                        username: response.user.providerData[0].displayName,
                        email: response.user.providerData[0].email,
                        photo: response.user.providerData[0].photoURL
                    });
                }

                // setUser(user?.providerData[0] )
    
                dispatch({
                    type: SET_USER,
                    payload: user?.providerData[0]
                });
            }catch(error) {
                console.log(error);
            }
        }else {
            setIsMenu(!isMenu)
        }
    }

      //function to sign out with firebase
      const logout = () => {
        
        setIsMenu(false);
        try {
            signOut(auth);
            dispatch({
                type: SIGN_OUT
            });
            setUserCart([]);
            setUid(null);
        }catch(error) {
            console.log(error);
         }
    }


    //context to show cart when clicked
    const showCart = () => {
        dispatch({
            type:SET_CART_SHOW,
            payload: !state.cartShow
        });
    }
    


    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setLoading(false);
          if (user) {
            dispatch({ type: SET_USER, payload: user });
            setUid(user?.uid);
          } else {
            dispatch({ type: SIGN_OUT });
          }
        });
    
        return unsubscribe;

      }, [auth]);



    useEffect(() => {
           
        const cartRef = collection(db, "foodItems");
        const cartQuery = query(cartRef);

        const unsubscribe = onSnapshot(cartQuery, (querySnapshot) => {
        const items = [];
            querySnapshot.forEach((doc) => {
                items.push({ ...doc.data() });
            });

            dispatch({
                type: FETCH_ITEMS,
                payload: items
            });
        
        });

        return () => {
            unsubscribe();
        };
         
    }, []);




    let Product; 
     const addToCart = async (foodItem) => {

        Product = foodItem;
        Product['qty'] = 1;
        Product['TotalProductPrice'] = Product.qty * Product.price;


        if (state.user !== null) {
            try {
                // Check if the item already exists in the user's cart
                 const cartRef = collection(db, `cart ${uid}`);


               

                const cartQuery = query(
                    cartRef,
                    where("title", "==", foodItem.title)
                );
                
                const cartSnap = await getDocs(cartQuery);

                if (!cartSnap.empty) {
                    // If the item already exists, update its quantity

                        const cartItemDoc = cartSnap.docs[0];
                    

                        const itemQuantity = cartItemDoc.data().qty;

                            updateDoc(cartItemDoc.ref, {
                            qty: cartItemDoc.data().qty + foodItem.qty,
                            price: Product.price * (itemQuantity + 1)
                        
                        });
                        
                        return;   
                    
                }
          
                // If the item does not exist, add it to the cart
                await setDoc(doc(cartRef, Product.id), {
                    ...Product
                });

                toast.success(`${foodItem.title} added to cart`);

            } catch (error) {
            console.error("Error adding item to cart:", error);
            }
        } else {
            toast.error('In order to add items to your cart, please log in first. ');
        }

     }

    //getting cart products from firestore collection and updating the state
    useEffect(() => {
        try {
            const cartRef = collection(db, `cart ${uid}`);
            const cartQuery = query(cartRef);
    
            const unsubscribe = onSnapshot(cartQuery, (querySnapshot) => {
            const newCartItems = [];
                querySnapshot.forEach((doc) => {
                    newCartItems.push({ ID: doc.id, ...doc.data() });
                });
    
                setUserCart(newCartItems);
            
            });
    
            return () => {
            unsubscribe();
            };

        }catch(error) {
            console.log('Error fetching data')
        }
    // eslint-disable-next-line
    }, [uid]);





        

     let Products;
       const incrementQuantity = async (cartProduct) => {
        Products = cartProduct;
        Products.qty = Products.qty + 1;

        const cartRef = collection(db, `cart ${uid}`);
      

     

           const cartQuery = query(
            cartRef,
            where("id", "==", Products.id)
        );
        const cartSnap = await getDocs(cartQuery);

            if (!cartSnap.empty) {
                const cartItemDoc = cartSnap.docs[0];
                const newQty = cartItemDoc.data().qty;


                    updateDoc(cartItemDoc.ref, {
                        ...Products,
                        price: Products.TotalProductPrice * (newQty + 1)
                }); 
                
            } 
          
    }



    let ProductsDecrease;
    const decrementQuantity = async (cartProduct) => {
        ProductsDecrease = cartProduct;

        if(ProductsDecrease.qty > 1) {
            ProductsDecrease.qty = ProductsDecrease.qty - 1;


            const cartRef = collection(db, `cart ${uid}`);
   

                const cartQuery = query(
                cartRef,
                where("id", "==", ProductsDecrease.id)
            );
            const cartSnap = await getDocs(cartQuery);

                if (!cartSnap.empty) {
                    const cartItemDoc = cartSnap.docs[0];
                    const newQty = cartItemDoc.data().qty;


                        updateDoc(cartItemDoc.ref, {
                            ...ProductsDecrease,
                            price: ProductsDecrease.TotalProductPrice * (newQty - 1)
                    }); 
                    
                } 
        }
        
       
    }




  return (
    <StateContext.Provider value={{user:state.user, incrementQuantity, decrementQuantity, cart:state.cart, userCart, uid, login, loading, isMenu, logout, setIsMenu, foodItems:state.foodItems, addToCart, showCart, cartShow:state.cartShow}}>
        {children}
    </StateContext.Provider>
  )
}

export default StateContextProvider;


export const useStateValue = () => {
    return useContext(StateContext);
}