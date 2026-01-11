import { Document, Types } from 'mongoose';
import { IUserDoc } from '../user/user.interface';

type ObjectId = Types.ObjectId;

export interface IDiscoveryDoc extends Document {
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
