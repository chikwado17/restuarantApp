import { SET_USER, AUTH_IS_READY, SIGN_OUT, FETCH_ITEMS, SET_CART_SHOW, ADD_TO_CART , FETCH_CART_ITEM, CLEAR_USERS_CART} from "./initialTypes";


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


        case ADD_TO_CART:
            return {
                ...state,
                cart: [...state.cart, action.payload]
            }


        case FETCH_CART_ITEM:
            return {
                ...state,
                cart: action.payload
            }

        case SET_CART_SHOW:
            return {
                ...state,
                cartShow: action.payload
            }

        case AUTH_IS_READY:
            return { ...state, user: action.payload, loading: false };

        case SIGN_OUT: 
            return {
                ...state,
                user: null,
                cart: []
            }


        default:
            return state;
    }
}

export default reducer;