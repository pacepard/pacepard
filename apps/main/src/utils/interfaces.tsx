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
  