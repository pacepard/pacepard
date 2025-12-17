import { IAPIReport, IPagination } from "@/utils/interfaces"
import { RefineType } from "@/utils/types"

export interface IClearResource {
    type: string,
    resource: 'multiple' | 'single'
}

export interface ICollection {
    data: Array<any>,
    report?: IAPIReport
    count: number,
    total: number,
    pagination: IPagination,
    loading: boolean,
    refineType?: RefineType,
    message?: string,
    payload?: any
}
