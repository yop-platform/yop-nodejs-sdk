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
  method: string;
  url: string;
  params?: Record<string, any>;
}

export interface RequestParams {
  url: string;
  params?: Record<string, any>;
  method: string;
  responseType?: string;
}

export interface ParamMap {
  [key: string]: any;
}

export interface Request {
  paramMap: ParamMap;
}
