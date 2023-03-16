import { SET_USER, AUTH_IS_READY, SIGN_OUT, FETCH_ITEMS } from "./initialTypes";


const reducer = (state, action) => {
    switch(action.type) {

        case SET_USER:
            return {
                ...state,
                user: action.payload
            }

        case FETCH_ITEMS:
            return {
                ...state,
                foodItems: action.payload
            }

        case AUTH_IS_READY:
            return { ...state, user: action.payload, loading: false };

        case SIGN_OUT: 
            return {
                ...state,
                user: null
            }


        default:
            return state;
    }
}

export default reducer;