import AxiosService from '@/api/core/axios';
import { IAPIResponse } from '@/api/types';
import {
    GetHackathonsDTO,
    GetHackathonDTO,
    CreateHackathonDTO,
    UpdateHackathonDTO,
} from '@/dtos/hackathon.dto';
import { URL_HACKATHONS } from '@/utils/path';

class HackathonAPI {
    constructor(private axiosService: AxiosService) {}

    getHackathons(payload: GetHackathonsDTO): Promise<IAPIResponse> {
        const { limit = 25, page = 1, sort = '-createdAt', workspaceId, status } = payload;
        const params = new URLSearchParams({
            limit: String(limit),
            page: String(page),
            sort,
        });
        if (workspaceId) params.append('workspace', workspaceId);
        if (status) params.append('status', status);

        return this.axiosService.call({
            type: 'default',
            method: 'GET',
            path: `${URL_HACKATHONS}/list?${params.toString()}`,
            isAuth: true,
            payload: {},
        });
    }

    getHackathon(payload: GetHackathonDTO): Promise<IAPIResponse> {
        return this.axiosService.call({
            type: 'default',
            method: 'GET',
            path: `${URL_HACKATHONS}/${payload.id}`,
            isAuth: true,
            payload: {},
        });
    }

    createHackathon(payload: CreateHackathonDTO): Promise<IAPIResponse> {
        return this.axiosService.call({
            type: 'default',
            method: 'POST',
            path: URL_HACKATHONS,
            isAuth: true,
            payload,
        });
    }

    updateHackathon(payload: UpdateHackathonDTO): Promise<IAPIResponse> {
        const { id, ...body } = payload;
        return this.axiosService.call({
            type: 'default',
            method: 'PUT',
            path: `${URL_HACKATHONS}/${id}`,
            isAuth: true,
            payload: body,
        });
    }

    deleteHackathon(id: string): Promise<IAPIResponse> {
        return this.axiosService.call({
            type: 'default',
            method: 'DELETE',
            path: `${URL_HACKATHONS}/${id}`,
            isAuth: true,
            payload: {},
        });
    }
}

export default HackathonAPI;
