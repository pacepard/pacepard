import Axios from 'axios';
import { CallApiDTO } from '../../dtos/axios.dto';
import storage from '../../storage/local-storage';
import { IAPIResponse } from '../types';

class AxiosService {
    public readonly baseUrl: string;

    constructor(baseUrl: string) {
        if (!baseUrl) {
            throw new Error('Pacepard API base url is required');
        }
        this.baseUrl = baseUrl;
    }

    /**
     * @name call
     * @param params
     * @returns
     */
    public async call(params: CallApiDTO): Promise<IAPIResponse> {
        let result: any = {};
        const { isAuth = false, method, path, type, payload } = params;

        let urlpath = `${this.baseUrl}${path}`;
        
        // Debug logging in development
        if (process.env.NODE_ENV === 'development') {
            console.log(`[API] ${method} ${urlpath}`, { isAuth, payload: payload instanceof FormData ? 'FormData' : payload });
        }

        // Check if payload is FormData - if so, don't set Content-Type (let browser set it with boundary)
        const isFormData = payload instanceof FormData;
        const baseHeaders = isAuth
            ? storage.getConfigWithBearer().headers
            : storage.getConfig().headers;
        
        // If FormData, exclude Content-Type to let browser set it automatically with boundary
        let headers: any;
        if (isFormData) {
            headers = { ...baseHeaders };
            delete headers['Content-Type'];
        } else {
            headers = baseHeaders;
        }

        await Axios({
            method: method,
            url: urlpath,
            data: payload,
            headers: headers,
        })
            .then((resp) => {
                result = resp.data;
            })
            .catch((err) => {
                if (err.response) {
                    // For all error responses, use the response data if available
                    if (err.response.data) {
                        result = {
                            ...err.response.data,
                            status: err.response.status,
                            // Ensure error flag is set for non-2xx status codes
                            error: err.response.status >= 400 ? true : (err.response.data.error ?? false),
                        };
                    } else {
                        // Fallback if no response data
                        result = {
                            error: true,
                            status: err.response.status,
                            errors: ['an error occurred'],
                            message: `Request failed with status ${err.response.status}`,
                            data: null,
                        };
                    }
                } else if (err.request) {
                    // Request was made but no response received (network error)
                    const isConnectionRefused = err.code === 'ERR_CONNECTION_REFUSED' || err.message?.includes('ERR_CONNECTION_REFUSED');
                    result = {
                        error: true,
                        status: 0,
                        errors: ['Network error'],
                        message: isConnectionRefused 
                            ? `Unable to connect to the API server at ${urlpath}. Please ensure the API server is running.`
                            : 'Unable to connect to the server. Please check your internet connection.',
                        data: null,
                    };
                } else if (typeof err === 'object') {
                    result = {
                        error: true,
                        status: undefined,
                        errors: ['an error occurred. please try again'],
                        message: err.message || 'Error',
                        data: err,
                    };
                } else if (typeof err === 'string') {
                    result = {
                        error: true,
                        status: undefined,
                        errors: [err.toString()],
                        message: err.toString(),
                        data: err.toString(),
                    };
                } else {
                    result = {
                        error: true,
                        status: undefined,
                        errors: ['an unknown error occurred'],
                        message: 'An unknown error occurred',
                        data: null,
                    };
                }
            });

        return result;
    }

    /**
     * @name logout
     */
    public async logout(): Promise<void> {
        storage.clearAuth();
        await this.call({
            method: 'POST',
            type: 'default',
            path: '/auth/logout',
            isAuth: false,
            payload: {},
        });
    }
}

export default AxiosService;
