

const appReducer = (state: any, action: any) => {
    switch (action.type) {
        case 'SET_APP_STATE':
            return { ...state, ...action.payload };
        default:
            return state;
    }
}

export default appReducer;