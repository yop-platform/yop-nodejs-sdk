import { Method, ResponseType } from "axios";
export interface RequestOptions {
  appKey: string;
  secretKey: string;
  serverRoot?: string;
  yopPublicKey?: string;
  config?: {
    contentType: string;
  };
}

export interface AuthHeaderOptions extends RequestOptions {
  method: Method;
  url: string;
  params?: Record<string, any>;
}

export interface RequestParams {
  url: string;
  params?: Record<string, any>;
  method: Method;
  responseType?: ResponseType;
}

export interface ParamMap {
  [key: string]: any;
}

export interface Request {
  paramMap: ParamMap;
}
