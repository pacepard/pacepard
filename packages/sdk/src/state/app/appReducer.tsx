import {
    GET_PLAN,
    GET_PLANS,
    GET_TRANSACTION,
    GET_TRANSACTIONS,
    SET_LOADING,
    SET_SEARCH,
    UNSET_LOADING,
} from '../helpers/types';



const appReducer = (state: any, action: any) => {
    switch (action.type) {
        case GET_PLANS:
            return {
                ...state,
                plans: action.payload,
            };
        case GET_PLAN:
            return {
                ...state,
                plan: action.payload,
            };
        case GET_TRANSACTIONS:
            return {
                ...state,
                transactions: action.payload,
            };
        case GET_TRANSACTION:
            return {
                ...state,
                transaction: action.payload,
            };
        case SET_SEARCH:
            return {
                ...state,
                search: action.payload,
            };
        case SET_LOADING:
            return {
                ...state,
                loading: true,
            };
        case UNSET_LOADING:
            return {
                ...state,
                loading: false,
                message: action.payload,
            };
        default:
            return {
                ...state,
            };
    }
};

export default appReducer;
