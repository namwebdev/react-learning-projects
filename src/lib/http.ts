import { cookies } from "next/headers";

type RequestMethod = "GET" | "POST" | "PUT" | "DELETE";
type RequestFormat = keyof Omit<Body, "body" | "bodyUsed">;
type QueryParamsType = Record<string | number, any>;

export enum ContentType {
  Json = "application/json",
  Text = "text/plain",
  FormData = "multipart/form-data",
  // UrlEncoded = "application/x-www-form-urlencoded",
}
interface HttpInitParams
  extends Omit<RequestInit, "body" | "method" | "headers"> {
  baseUrl: string;
  format?: RequestFormat;
}
interface RequestParams extends Partial<HttpInitParams> {
  path: string;
  method: RequestMethod;
  body?: unknown;
  query?: QueryParamsType;
  secure?: boolean;
}
interface HttpResonse<D, E> {
  data: D;
  error: E;
}
// error response from API server
interface ErrorStatusCode {
  statusCode: number;
}
interface ErrorModel extends ErrorStatusCode {
  /** modify this to fit with error response from your API server **/
  status: string;
  message: string;
}

export class HttpClient {
  private baseUrl = "";
  private format: RequestFormat = "json";

  constructor(config: HttpInitParams) {
    Object.assign(this, config);
  }

  request = async <D, E = ErrorModel>(
    params: RequestParams
  ): Promise<HttpResonse<D, E>> => {
    const baseHeaders: HeadersInit = {
      "Content-Type": ContentType.Json,
      Accept: "application/json",
    };

    const fallbackDataResponse = null as unknown as D;
    const fallbackErrorResponse = null as unknown as E;

    const { path, method, query, body = null, secure, format } = params;
    if (format) this.format = format;

    let queryString = this.toQueryString(query);
    if (queryString) queryString = "?" + queryString;

    const fullRequestUrl = this.baseUrl + path + queryString;

    let fullRequestParams = {
      headers: baseHeaders,
      ...{ method },
      ...(!!body && { body: this.bodyConverter(body) }),
    };
    if (secure) {
      const cookieHeader = (await cookies()).toString();
      fullRequestParams.headers["Cookie"] = cookieHeader;
    }

    const res = await fetch(fullRequestUrl, fullRequestParams);

    let jsonRes = null;
    try {
      jsonRes = await res.json();
    } catch (e) { }

    if (!res.ok) {
      return {
        data: fallbackDataResponse,
        error: { ...jsonRes, ...{ statusCode: res.status } } as E,
      };
    }

    return {
      data: jsonRes as D,
      error: fallbackErrorResponse,
    };
  };

  // Functions convert params to query string
  private encodeQueryParam(key: string, value: any) {
    const encodedKey = encodeURIComponent(key);
    return `${encodedKey}=${encodeURIComponent(
      typeof value === "number" ? value : `${value}`
    )}`;
  }
  private addQueryParam(query: QueryParamsType, key: string) {
    return this.encodeQueryParam(key, query[key]);
  }
  private addArrayQueryParam(query: QueryParamsType, key: string) {
    const value = query[key];
    return value.map((v: any) => this.encodeQueryParam(key, v)).join("&");
  }
  private toQueryString(query: QueryParamsType = {}): string {
    const getQueryItem = (key: string) => {
      if (Array.isArray(query[key])) return this.addArrayQueryParam(query, key);
      return this.addQueryParam(query, key);
    };

    const keys = Object.keys(query).filter(
      (key) => "undefined" !== typeof query[key]
    );
    return keys.map((key) => getQueryItem(key)).join("&");
  }
  // -------------------------------------------------

  private bodyConverter(input: any) {
    return JSON.stringify(input);
  }
}