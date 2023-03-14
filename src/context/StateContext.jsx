import React, { createContext, useContext, useReducer, useEffect, useState } from 'react';

import { getAuth, signInWithPopup, GoogleAuthProvider,onAuthStateChanged, signOut } from 'firebase/auth';
import { db } from '../firebase';
import { doc, setDoc, getDoc } from "firebase/firestore"; 
import { app } from "../firebase";


import { SET_USER, SIGN_OUT } from './initialTypes';
import { initialState } from './initialState';
import  reducer  from './reducer';




const StateContext = createContext();



const StateContextProvider = ({children}) => {
    const [loading, setLoading] = useState(true);
    const [isMenu, setIsMenu] = useState(false);

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
                    type: SET_USER,
                    payload: user.providerData[0]
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




        
       
    

    

    

    //firebase function to check if user is logged in
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            dispatch({ 
                type: "AUTH_IS_READY", 
                payload: user?.providerData[0] 
            });
            setLoading(false);
        });

       

        return () => unsubscribe();

        // eslint-disable-next-line
    }, []);

   

  return (
    <StateContext.Provider value={{user:state.user, login, loading, isMenu, logout}}>
        {children}
    </StateContext.Provider>
  )
}

export default StateContextProvider;


export const useStateValue = () => {
    return useContext(StateContext);
}