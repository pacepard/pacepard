import AxiosService from '../core/axios';
import AuthAPI from './auth';
import WorkspaceAPI from './workspace';
import UserAPI from './user';
import StorageAPI from './storage';
import HackathonAPI from './hackathon';

/**
 * Internal API client
 * Holds all feature modules
 */
class PacepardAPIClient {
    public auth: AuthAPI;
    public workspace: WorkspaceAPI;
    public user: UserAPI;
    public storage: StorageAPI;
    public hackathon: HackathonAPI;

    constructor(axiosService: AxiosService) {
        this.auth = new AuthAPI(axiosService);
        this.workspace = new WorkspaceAPI(axiosService);
        this.user = new UserAPI(axiosService);
        this.storage = new StorageAPI(axiosService);
        this.hackathon = new HackathonAPI(axiosService);
    }
}

/**
 * Global instance for internal SDK use
 */
let globalInstance: PacepardAPIClient | null = null;

function setGlobalInstance(instance: PacepardAPIClient): void {
    globalInstance = instance;
}

/**
 * Accessor used by hooks and internal helpers
 */
export function pacepardAPIClient(): PacepardAPIClient {
    if (!globalInstance) {
        throw new Error(
            'Pacepard SDK not initialized. Create an instance first with new Pacepard(baseUrl)',
        );
    }
    return globalInstance;
}

/**
 * Main SDK class exposed to users
 *
 * Example:
 * const pacepard = new Pacepard('http://localhost:5015/api/v1')
 * await pacepard.auth.loginUser(...)
 */
class Pacepard extends PacepardAPIClient {
    constructor(baseUrl: string) {
        const axiosService = new AxiosService(baseUrl);
        super(axiosService);
        setGlobalInstance(this);
    }
}

export default Pacepard;
