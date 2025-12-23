//import { IAPIKey, IUserCountry, IUserPermission } from "../utils/interfaces.util";

interface User {

    avatar: string,
    logo: string,
    firstName: string;
    lastName: string;
    middleName: string,
    phoneNumber: string;
    phoneCode: string;
    countryPhone: string,
    altPhone: string,
    email: string;
    passwordType: string;
    userType: string;
    businessName: string,
    businessType: string,
    login: {
        last: string,
        method: string
    },
    onboard: {
        step: number,
        status: string,
    },
    status: {
        profile: string
    };
    inviteStatus: string;
    // apiKey: IAPIKey
    // keys: Array<IAPIKey>

    isSuper: boolean;
    isAdmin: boolean;
    isBusiness: boolean;
    isUser: boolean;
    isTalent: boolean;
    isActivated: boolean;
    isActive: boolean;
    loginLimit: number;
    isLocked: boolean;

    // relationships
    //country: IUserCountry;
    roles: Array<any>;
    //permissions: Array<IUserPermission>;
    verification: any;
    notifications: Array<any>
    devices: Array<any>

    // time stamps
    createdAt: string;
    updatedAt: string;
    _version: number;
    _id: any;
    id: any;

}

export default User;