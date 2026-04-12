// Cookie Service
export { default as cookieService } from './services/cookies';

// Storage Service
export {
    default as storage,
    persistAuthFromResponse,
} from './storage/local-storage';

// Idempotent Service
export { default as idempotentService } from './services/idempotent';

// Query Provider
export { QueryProvider } from './services/query';

// SDK Main Class
export { default as Pacepard, pacepardAPIClient } from './api/clients/pacepard';

// Types
export * from './types/types';
export * from './utils/enums';
export * from './utils/interfaces';
export * from './utils/helpers';
export * as baseTypes from './utils/types';

// DTOs
export * from './dtos/hackathon.dto';

// Routes
export { default as routes } from './routes/routes';
export {
    default as routil,
    getHackathonPath,
    getProjectPath,
    getChallengePath,
} from './routes/helper';

// Contexts
export { default as UserContext } from './state/user/userContext';
export { default as AppContext } from './state/app/appContext';
export { default as UserState } from './state/user/userState';
export { default as AppState } from './state/app/appState';
export type { IUserContext, IAppContext } from './state/helpers/interface';
