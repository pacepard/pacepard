import { IPagination } from "@/utils/interfaces";

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