import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import instance from "@/axios";
import { axiosConfig } from "./config";

export function request<T>(method: AxiosRequestConfig["method"], url: string, data: any, config?: AxiosRequestConfig) {
  const CancelToken = axios.CancelToken;
  const source = CancelToken.source();
  if (!config) {
    config = {};
  }
  config.cancelToken = source.token;
  config.method = method;
  config.url = url;
  config.data = data;

  return [instance.request<T>(config), source.cancel] as const;
}

export function get<T>(url: string, config?: AxiosRequestConfig) {
  return request<T>("get", url, undefined, config ? Object.assign(config, axiosConfig) : axiosConfig);
}

export function post<T>(url: string, data: any, config?: AxiosRequestConfig) {
  return request<T>("post", url, data, config);
}

export function put<T>(url: string, data: any, config?: AxiosRequestConfig) {
  return request<T>("put", url, data, config);
}

export function del<T>(url: string, config?: AxiosRequestConfig) {
  return request<T>("delete", url, undefined, config);
}

export function minPage(res: AxiosResponse, perPage = 10) {
  return Math.max(0, Math.ceil(((parseInt(res.headers["x-past-results"], 10) || 0) - perPage / 2) / perPage)) + 1;
}

export function maxPage(res: AxiosResponse, perPage = 10) {
  return Math.max(0, Math.ceil(((parseInt(res.headers["x-future-results"], 10) || 0) - perPage / 2) / perPage)) + 1;
}

export function pageCount(res: AxiosResponse, perPage = 10, prevVal: number = 0) {
  return Math.ceil((parseInt(res.headers["x-count"], 10) || 0) / perPage) || prevVal;
}

export const handlePaginatedResp =
  (params: { perPage?: number } = { perPage: 10 }) =>
  (res: AxiosResponse) => ({
    data: res.data,
    lastPage: pageCount(res, params.perPage),
    maxPage: maxPage(res, params.perPage),
    minPage: minPage(res, params.perPage),
    loading: false,
  });

export const handlePaginatedErr = (err: Error) => {
  console.error(err, "error handling paginated req inside SSP");
  return {
    data: [],
    lastPage: 0,
    maxPage: 0,
    minPage: 0,
  };
};
