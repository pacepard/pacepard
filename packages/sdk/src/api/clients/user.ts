import AxiosService from '@/api/core/axios';
import { IAPIResponse } from '@/api/types';
import { IListQuery } from '@/utils/interfaces';
import { URL_USERS, URL_LOGGEDIN_USER, URL_TALENT } from '@/utils/path';

interface ISendUsersUpdate {
    title: string;
    content: string;
    users: Array<string>;
}

interface IInviteTalent {
    title: string;
    content: string;
    email: string;
    firstName: string;
    lastName: string;
    callbackUrl: string;
}

class UserAPI {
    constructor(private axiosService: AxiosService) {}

    /**
     * @name getUsers
     * @description Fetches a list of users from the API.
     * @param {IListQuery} payload The query parameters for fetching users.
     * @param {boolean} all Whether to fetch all users or paginated.
     * @returns {Promise<IAPIResponse>} Server response with users list.
     */
    getUsers(payload: IListQuery, all: boolean = false): Promise<IAPIResponse> {
        const { limit, page, order } = payload;
        const q = `limit=${limit ? limit.toString() : 25}&page=${page ? page.toString() : 1}&order=${order ? order : 'desc'}`;

        let path = `${URL_USERS}?${q}`;
        if (all) {
            path = `${URL_USERS}/all?cache=false&${q}`;
        }

        return this.axiosService.call({
            type: 'default',
            method: 'GET',
            path: path,
            isAuth: true,
            payload: {},
        });
    }

    /**
     * @name getUser
     * @description Fetches a specific user by ID or the logged-in user.
     * @param {string} userId Optional user ID. If not provided, fetches the logged-in user.
     * @returns {Promise<IAPIResponse>} Server response with user data.
     */
    getUser(userId?: string): Promise<IAPIResponse> {
        const path = userId ? `${URL_LOGGEDIN_USER}/${userId}` : URL_LOGGEDIN_USER;

        return this.axiosService.call({
            type: 'default',
            method: 'GET',
            path: path,
            isAuth: true,
            payload: {},
        });
    }

    /**
     * @name getTalents
     * @description Fetches a list of talents from the API.
     * @param {IListQuery} payload The query parameters for fetching talents.
     * @returns {Promise<IAPIResponse>} Server response with talents list.
     */
    getTalents(payload: IListQuery): Promise<IAPIResponse> {
        const { limit, page, order } = payload;
        const q = `limit=${limit ? limit.toString() : 25}&page=${page ? page.toString() : 1}&order=${order ? order : 'desc'}`;

        return this.axiosService.call({
            type: 'default',
            method: 'GET',
            path: `${URL_TALENT}?${q}`,
            isAuth: true,
            payload: {},
        });
    }

    /**
     * @name getTalent
     * @description Fetches a specific talent by ID.
     * @param {string} userId The talent/user ID.
     * @returns {Promise<IAPIResponse>} Server response with talent data.
     */
    getTalent(userId: string): Promise<IAPIResponse> {
        return this.axiosService.call({
            type: 'default',
            method: 'GET',
            path: `${URL_TALENT}/${userId}`,
            isAuth: true,
            payload: {},
        });
    }

    /**
     * @name sendUsersUpdate
     * @description Sends an update notification to multiple users.
     * @param {ISendUsersUpdate} payload The data for sending updates.
     * @returns {Promise<IAPIResponse>} Server response.
     */
    sendUsersUpdate(payload: ISendUsersUpdate): Promise<IAPIResponse> {
        return this.axiosService.call({
            type: 'default',
            method: 'POST',
            path: `${URL_USERS}/send-update`,
            isAuth: true,
            payload,
        });
    }

    /**
     * @name inviteTalent
     * @description Invites a new talent user.
     * @param {IInviteTalent} payload The data for inviting a talent.
     * @returns {Promise<IAPIResponse>} Server response.
     */
    inviteTalent(payload: IInviteTalent): Promise<IAPIResponse> {
        return this.axiosService.call({
            type: 'default',
            method: 'POST',
            path: `${URL_USERS}/invite-talent`,
            isAuth: true,
            payload,
        });
    }
}

export default UserAPI;

