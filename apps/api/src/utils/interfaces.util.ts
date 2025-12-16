export type Nullable<T> = T | null;

export interface IResult<T = any> {
    error: boolean;
    message: string;
    code: number;
    data: any;
    total?: number;
  }