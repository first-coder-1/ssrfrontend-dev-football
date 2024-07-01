import axios, { AxiosHeaders } from "axios";

export const createXSign = (url: string) =>
  btoa(url.substr(0, 32) + process.env.NEXT_PUBLIC_APP_SIGN! + url.substr(32));

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL + "/api",
  responseType: "json",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(function (config) {
  const url = api.getUri(config);
  if (!config.headers) {
    config.headers = {} as AxiosHeaders;
  }
  config.headers["X-Sign"] = createXSign(url);
  return config;
});

export default api;
