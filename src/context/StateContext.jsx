import React, { createContext, useContext, useReducer, useEffect, useState } from 'react';

import { getAuth, signInWithPopup, GoogleAuthProvider,onAuthStateChanged, signOut } from 'firebase/auth';
import { db } from '../firebase';
import { doc, setDoc, getDoc, getDocs, collection, query, updateDoc, where, onSnapshot} from "firebase/firestore"; 
import { app } from "../firebase";


import { FETCH_ITEMS, SET_CART_SHOW, SET_USER, SIGN_OUT, ADD_TO_CART } from './initialTypes';
import { initialState } from './initialState';
import  reducer  from './reducer';




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
                        userId: response.user.providerData[0].uid,
                        username: response.user.providerData[0].displayName,
                        email: response.user.providerData[0].email,
                        photo: response.user.providerData[0].photoURL
                    });
                }
    
                dispatch({
                    type: SET_USER
                });
            }catch(error) {
                console.log(error);
            }
        }else {
            setIsMenu(!isMenu)
        }
    }


    //function to sign out with firebase
    const logout = async () => {
        setIsMenu(false);
        try {
            await signOut(auth);
            dispatch({
                type: SIGN_OUT
            });
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

    //firebase function to check if user is logged in
    useEffect(() => {

  
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setLoading(false);
           if(user) {
            dispatch({ 
                type: "AUTH_IS_READY", 
                payload: user?.providerData[0] 
            });

            setUid(user?.uid);
           }
           
        });

        // fetchFoodItems();
        // fetchCartItems();
        return () => unsubscribe();
        
        // eslint-disable-next-line
    }, []);



    

//function to add to cart to firestore
        const addToCart = async (foodItem) => {
        if (uid !== null) {
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
                        price: foodItem.price * (itemQuantity + 1),
                    
                    });
                    
                    return;   
                   
            }
          
            // If the item does not exist, add it to the cart
            await setDoc(doc(db, `cart ${uid}`, `${Date.now()}`), {
                ...foodItem
            });
            
            dispatch({
                type: ADD_TO_CART,
                payload: foodItem,
            });
            } catch (error) {
            console.error("Error adding item to cart:", error);
            }
        } else {
            console.log("User is not logged in");
        }
    };
        


        // useEffect(() => {
        //     if (uid !== null) {
        //       const cartRef = collection(db, `cart ${uid}`);
        //       const cartQuery = query(cartRef);
        
        //       const unsubscribe = onSnapshot(cartQuery, (querySnapshot) => {
        //         const newCartItems = [];
        //         querySnapshot.forEach((doc) => {
        //           newCartItems.push({ id: doc.id, ...doc.data() });
        //         });
               
        //       });
        
        //       return () => {
        //         unsubscribe();
        //       };
        //     }
        //   }, [uid]);




       useEffect(() => {
    
        if(uid !== null) {
            const fetchCartItems =  () => {

                try {

                    const itemsSnap = collection(db, "cart " + uid);

                    const unsubscribe = onSnapshot(itemsSnap, (querySnapshot) => {
                        const newCartItems = [];
                            querySnapshot.forEach((doc) => {
                            newCartItems.push({ ...doc.data() });
                        });

                        setUserCart(newCartItems);
                    });

                    return () => {
                        unsubscribe();
                    };

                }catch(error) {
                    console.log(error);
                }
            }

            fetchCartItems();
        }
         
       }, [uid])

   

  return (
    <StateContext.Provider value={{user:state.user, cart:state.cart, login, loading, isMenu, logout, setIsMenu, userCart, foodItems:state.foodItems, addToCart, showCart, cartShow:state.cartShow}}>
        {children}
    </StateContext.Provider>
  )
}

export default StateContextProvider;


export const useStateValue = () => {
    return useContext(StateContext);
}