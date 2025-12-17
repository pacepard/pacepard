import { useMemo, useReducer } from 'react';
import { collection } from '../seed';
import appReducer from './appReducer';
import { SET_LOADING, UNSET_LOADING } from '../types';
import { ISetLoading, IUnsetLoading } from '@/utils/interfaces';
import { IClearResource, ICollection } from '../interface';
import AppContext from './appContext';



const AppState = (props: any) => {
    const initialState = {
        users: collection, // all users
        user: {}, // a single user

        plans: collection,
        plan: {},
        transactions: collection,
        transaction: {},

        hackathons: collection, // list of hackathons
        hackathon: {}, // currently selected hackathon
        projects: collection, // all projects
        project: {}, // one selected project

        submissions: collection, // all submissions
        submission: {},
        search: collection, // search results
        filters: collection, // filters results
        loading: false,
    };

    const [state, dispatch] = useReducer(appReducer, initialState);

    /**
     * @name setLoading
     * @param data
     */
    const setLoading = async (data: ISetLoading) => {
        if (data.option === 'default') {
            dispatch({
                type: SET_LOADING,
            });
        }

        if (data.option === 'resource' && data.type) {
            const { loading, ...rest } = collection;

            dispatch({
                type: data.type,
                payload: {
                    ...rest,
                    loading: true,
                },
            });
        }
    };

    /**
     * @name unsetLoading
     * @param data
     */
    const unsetLoading = async (data: IUnsetLoading) => {
        if (data.option === 'default') {
            dispatch({
                type: UNSET_LOADING,
                payload: data.message,
            });
        }

        if (data.option === 'resource' && data.type) {
            const { loading, message, ...rest } = collection;

            dispatch({
                type: data.type,
                payload: {
                    ...rest,
                    loading: false,
                    message: data.message,
                },
            });
        }
    };

    /**
     * @name clearResource
     * @param data
     */
    const clearResource = (data: IClearResource) => {
        let payload: any = {};

        if (data.resource === 'multiple') {
            payload = collection;
        }

        dispatch({
            type: data.type,
            payload: payload,
        });
    };

    /**
     * @name setCollection
     * @param type
     * @param data
     */
    const setCollection = (type: string, data: ICollection) => {
        dispatch({
            type: type,
            payload: data,
        });
    };

    /**
     * @name setResource
     * @param type
     * @param data
     */
    const setResource = (type: string, data: any) => {
        dispatch({
            type: type,
            payload: data,
        });
    };

    const contextValues = useMemo(
        () => ({
            plans: state.plans,
            plan: state.plan,
            transactions: state.transactions,
            transaction: state.transaction,
            search: state.search,
            filters: state.filters,
            loading: state.loading,
            setLoading: setLoading,
            unsetLoading: unsetLoading,
            clearResource: clearResource,
            setCollection: setCollection,
            setResource: setResource,
        }),
        [
            state.plans,
            state.plan,
            state.transactions,
            state.transaction,
            state.search,
            state.filters,
            state.loading,
            setLoading,
            unsetLoading,
            clearResource,
            setCollection,
            setResource,
        ]
    );

    return (
        <AppContext.Provider value={contextValues}>
            {props.children}
        </AppContext.Provider>
    );
};

export default AppState;
