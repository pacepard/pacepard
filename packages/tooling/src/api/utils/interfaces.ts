
export interface IApiError {
    response?: {
      status: number;
      data?: {
        message?: string;
        detail?: string;
        errors?: Array<string>;
      };
      headers?: Record<string, string>;
    };
    code?: string;
    message?: string;
  }
  
  
  export interface IResult {
    [x: string]: any;
    error: boolean;
    message: string;
    code: number;
    data: any;
  }
  
  
  export interface IAPIResponse {
    error: boolean;
    errors: Array<any>;
    count?: number;
    total?: number;
    pagination?: IPagination;
    data: any;
    message: string;
    token?: string;
    status: number;
  }

  export interface IPagination {
    next: { page: number; limit: number };
    prev: { page: number; limit: number };
  }
  
  export interface IStorage {
    storeAuth(token: string, id: string, userType: string, email: string): void;
    checkToken(): boolean;
    getToken(): string | null;
    checkUserID(): boolean;
    getUserID(): string;
    checkUserType(): boolean;
    getUserType(): string | null;
    checkUserEmail(): boolean;
    getUserEmail(): string | null;
    getConfig(): any;
    getConfigWithBearer(): any;
    clearAuth(): void;
    keep(key: string, data: any): boolean;
    keepLegacy(key: string, data: any): boolean;
    fetch(key: string): any;
    fetchLegacy(key: string): any;
    deleteItem(key: string, legacy?: boolean): boolean;
    trimSpace(str: string): string;
    copyCode(code: string): boolean;
    debugAuth(): any;
  }
  