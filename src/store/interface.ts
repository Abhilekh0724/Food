import { NavigateFunction } from "react-router-dom";

export interface metaI {
  pagination: {
    total: number;
    pageSize: number;
    currentPage: number;
    nextPage: number | null;
    prevPage: number | null;
    pageCount: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export interface ApiResponseI {
  id?: string;
  data?: any;
  meta?: metaI;
}

export interface ParamsI {
  data?: FormData | { [key: string]: any };
  closeModal?: () => void;
  logout?: () => void;
  params?:
  | string
  | {
    pageSize?: number;
    page?: number;
    [key: string]: any;
  };
  id?: string;
  navigate?: NavigateFunction;
  onClose?: () => void;
  actionBy?: string
}

export interface InitialStateI {
  fetchLoading?: boolean;
  isLoading?: boolean;
  data?: {
    data?: Array<Record<string, any>>;
    meta?: metaI;
  };
  singleData?: Record<string, any> | null;
  stats?: Record<string, any> | null;
}
