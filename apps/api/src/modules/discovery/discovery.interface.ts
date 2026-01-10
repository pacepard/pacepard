<<<<<<< HEAD
import { Document, Types } from "mongoose";
=======
import { Document, Types } from 'mongoose';
import { IUserDoc } from '../user/user.interface';
>>>>>>> af983945d9f8cb5ed1b44582a235135877f343b3

type ObjectId = Types.ObjectId;

export interface IDiscoveryDoc extends Document {
<<<<<<< HEAD

     // time stamps
     createdAt: Date;
     updatedAt: Date;
     _version: number;
     _id: ObjectId;
     id: ObjectId;

}
=======
    name: string;
    description: string;
    isActive: boolean;
    metadata: IMetadata;
    createdBy: IUserDoc;

    // settings: {
     // language: string
     // isClosed: string
     // closeTime: string
     // closeDate: string
     // closeTimeZone: string
     // closeMessageTitle: string
     // closeMessageDescription: string
     // redirectOnClose: string
     //}

    // time stamps
    createdAt: Date;
    updatedAt: Date;
    _version: number;
    _id: ObjectId;
    id: ObjectId;
}

export interface IMetadata {
    metaSiteName: string;
    metaSiteFaviconUrl: string;
    metaTitle: string;
    metaDescription: string;
    metaImageUrl: string;
}
>>>>>>> af983945d9f8cb5ed1b44582a235135877f343b3
