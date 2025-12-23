import Plan from "@/dtos/plan.dto"
import Subscription from "@/dtos/subscription"
import Talent from "@/dtos/talent.dto"
import Transaction from "@/dtos/transaction.dto"
import User from "@/dtos/user.dto"
import { IAPIReport, IPagination, ISetLoading, ISidebarProps, IToastState, IUnsetLoading } from "@/utils/interfaces"
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
    
export interface IUserContext {
    users: ICollection,
    user: User,
    talent: Talent,
    subscription: Subscription,
    plan: Plan,
    userType: string,
    businessType: string,
    loading: boolean,
    sidebar: ISidebarProps,
    toast: IToastState,
    setToast(data: IToastState): void,
    clearToast(): void,
    setSidebar(data: ISidebarProps): void,
    currentSidebar(collapse: boolean): ISidebarProps | null,
    setUserType(type: string): void,
    setBusinessType(type: string): void,
    setCollection(type: string, data: ICollection): void,
    setResource(type: string, data: any): void
    setLoading(data: ISetLoading): void,
    unsetLoading(data: IUnsetLoading): void,
}

export interface IAppContext {

    search: ICollection,
    items: Array<any>

    plans: ICollection,
    plan: Plan,
    transactions: ICollection,
    transaction: Transaction,
    message: string,
    loading: boolean,
    clearResource(data: IClearResource): void,
    setCollection(type: string, data: ICollection): void,
    setResource(type: string, data: any): void
    setLoading(data: ISetLoading): void,
    unsetLoading(data: IUnsetLoading): void,
}