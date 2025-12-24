import {
    GET_PLAN,
    GET_PLANS,
    GET_TASK,
    GET_PROJECT,
    GET_TRANSACTION,
    GET_TRANSACTIONS,
    SET_LOADING,
    SET_SEARCH,
    UNSET_LOADING,
    GET_TEAM,
    GET_SQUAD,
    GET_BUSINESS,
    GET_ADMIN,
    GET_HACKATHON,
    GET_ENTRY,
    GET_SUBMISSION,
    GET_TALENT,
} from '../helpers/types';



const appReducer = (state: any, action: any) => {
    switch (action.type) {
        case GET_BUSINESS:
            return {
                ...state,
                business: action.payload,
            };
        case GET_ADMIN:
            return {
                ...state,
                admin: action.payload,
            };
        case GET_HACKATHON:
            return {
                ...state,
                hackathon: action.payload,
            };
        case GET_ENTRY:
            return {    
                ...state,
                entry: action.payload,
            };
        case GET_SUBMISSION:
            return {
                ...state,
                submission: action.payload,
            };
        case GET_SQUAD:
            return {
                ...state,
                squad: action.payload,
            };
        case GET_PROJECT:
            return {
                ...state,
                project: action.payload,
            };
        case GET_TEAM:
            return {
                ...state,
                team: action.payload,
            };
        case GET_TASK:
            return {
                ...state,
                task: action.payload,
            };
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
