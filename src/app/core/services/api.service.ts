import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from "../../../environments/environment";
import { ApiQuery } from '../miscellaneous/api-query.template';

@Injectable({ providedIn: 'root' })
export class ApiService {

  baseURL = environment.serverApiUrl;

  constructor(private http: HttpClient) { }
   
  /**
   * function get is the Http handler for HTTP GET curl request
   * By default response object is returned unless you pass getHeaders = true
   * For querying one object by id that is in the url construct the url string parameter to the following: "url/id"
   * @param  {string} url API URL (Required)
   * @param  {ApiQuery} queryParams API Query Parameters (Nullable)
   * @param  {boolean} getheaders Watch Http Response header and body (Nullable, Default = false)
   * @returns Observable of type any
   */
  get(url: string, queryParams?: ApiQuery, getheaders: boolean = false): Observable<any> {
    let httpParams: HttpParams = null;
    let body: any = {};

    // Check if user is sending http query parameters
    if (queryParams) {
      httpParams = this.getHttpParams(queryParams);
      body.params = httpParams;
    }

    // Observe body or response
    // It is used to read values from response header and body or only read json object
    body.observe = getheaders ? 'response' : 'body';

    return this.http.get<any>(`${this.baseURL}${url}`, body)
      .pipe(map(response => { return response; }));
  }


  /**
   * function post is the HTTP handler for HTTP POST curl request
   * @param  {string} url API URL (Required)
   * @param  {any} obj Object to be created (Required)
   */
  post(url: string, obj: any) {
    return this.http.post<any>(`${this.baseURL}${url}`, obj)
      .pipe(map(response => { return response; }));
  }


  /**
   * function put is the HTTP handler for HTTP PUT curl request
   * For updating an object that is required in the url construct the url string parameter to the following: "url/id"
   * @param  {string} url API URL (Required)
   * @param  {any} obj Object to be updated (Required)
   */
  put(url: string, obj: any) {
    return this.http.put<any>(`${this.baseURL}${url}`, obj)
      .pipe(map(response => { return response; }));
  }

  patch(url: string, obj: any) {
    return this.http.patch<any>(`${this.baseURL}${url}`, obj)
      .pipe(map(response => { return response; }));
  }


  /**
   * function delete is the HTTP handler for HTTP DELETE curl request
   * For deleting an object that is required in the url construct the url string parameter to the following: "url/id"
   * @param  {string} url API URL (Required)
   */
  delete(url: string) {
    return this.http.delete(`${this.baseURL}${url}`)
      .pipe(map(response => { return response }));
  }
  downloadFile(url: string): Observable<any> {
    let params: any = { observe: 'body', responseType: 'blob' };
    return this.http.get<any>(`${this.baseURL}${url}`, params)
      .pipe(map(res => { return res; }));
  }

  query(url: string, queryParams?: ApiQuery, getheaders: boolean = false): Observable<any> {
    {
      let httpParams = this.getHttpParams(queryParams);
      let api: string = queryParams?.search ? `${this.baseURL}${url}/search` : `${this.baseURL}${url}`;
      console.log("api :: " , api);
      let body: any = (!getheaders) ? { params: httpParams, observe: 'body' } : { params: httpParams, observe: 'response' };

      return this.http.get(api, body).pipe(map((response) => {
        return response;
      }));
    }
  }
  /**
   *  function getFile is the HTTP handler for HTTP GET curl request
   * By default response object is returned as blob
   * @param  {string} url API URL (Required)
   * @param  {ApiQuery} queryParams API Query Parameters (Nullable)
   */
  getFile(url: string, queryParams?: ApiQuery) {
    let body: any = {};
    let httpParams: HttpParams;

    if (queryParams) {
      httpParams = this.getHttpParams(queryParams);
      body.params = httpParams;
    }

    body.observe = 'body';
    body.responseType = 'blob';

    return this.http.get<any>(`${this.baseURL}${url}`, body)
      .pipe(map(res => { return res; }));
  }

  private getHttpParams = (queryParams?: ApiQuery): HttpParams => {
    let params: HttpParams = new HttpParams();

    const specialParams = ['sort', 'advancedSearch', 'search', 'contains', 'notInFilter', 'filter', 'findNull', 'greaterThan', 'lessThan', 'params'];
    if (queryParams) {
      Object.keys(queryParams).forEach(key => {
        if (!specialParams.includes(key)) {
          params = params.set(key, queryParams[key]);
        }
      });
      if (queryParams.sort) {
        queryParams.sort.forEach((val: string) => {
          params = params.append('sort', val);
        });
      }
      if (queryParams.params) {
        for (let [key, value] of queryParams.params) {
          params = params.append(key, value);
        }
      }
      if (queryParams.search || queryParams.contains) {
        let toIterate = queryParams.search ? queryParams.search : queryParams.contains
        for (let [key, value] of toIterate) {
          params = params.append(key + ".contains", value)
        }
      } else
        if (queryParams.advancedSearch) {
          let filters = queryParams.advancedSearch;
          Object.keys(filters).forEach(key => {
            let colFilter = filters[key]
            let colValue = colFilter['value']
            let matchMode = colFilter['matchMode']
            if (matchMode === 'equals') {
              if (colValue.startsWith('*') && colValue.endsWith('*')) {
                colValue = colValue.split('*')[1]
                matchMode = 'contains'
                params = params.append(key + "." + matchMode, colValue)
              } else if (colValue.startsWith('*')) {
                matchMode = 'endsWith'
                let colValues = colValue.split('*');
                colValue = colValues[colValues.length - 1]
                params = params.append(key + "." + matchMode, colValue)
              } else if (colValue.endsWith('*')) {
                matchMode = 'startsWith'
                colValue = colValue.split('*')[0]
                params = params.append(key + "." + matchMode, colValue)
              } else if (colValue.indexOf('*') !== -1) {
                let values = colValue.split('*')
                params = params.append(key + "." + 'startsWith', values[0])
                params = params.append(key + "." + 'endsWith', values[values.length - 1])
              } else {
                params = params.append(key + "." + matchMode, colValue)
              }
            }
            else if (matchMode === 'between') {
              params = params.append(key + ".greaterThanOrEqual", colValue[0]);
              params = params.append(key + ".lessThanOrEqual", colValue[1]);
            }
            else if (matchMode === 'list') {
              if (colValue instanceof Array) {
                params = params.append(key + ".in", colValue.toString());
              }
              else {
                params = params.append(key + ".equals", colValue);
              }
            }
            else if (matchMode === 'check') {
              params = params.append(key + ".equals", colValue);
            }
            else {
              params = params.append(key + "." + matchMode, colValue)
            }
          })
        }
      if (queryParams.filter) {
        for (let [key, value] of queryParams.filter) {
          if (value instanceof Array) {
            params = params.append(key + ".in", value.toString());
          }
          else {
            params = params.append(key + ".equals", value);
          }
        }
      }
      if (queryParams.notInFilter) {
        for (let [key, value] of queryParams.notInFilter) {
          if (value instanceof Array) {
            params = params.append(key + ".notIn", value.toString());
          }
          else {
            params = params.append(key + ".notEquals", value);
          }
        }
      }
      if (queryParams.findNull) {
        for (let key of queryParams.findNull) {
          params = params.append(key + ".specified", 'false');
        }
        if (queryParams.greaterThan) {
          for (let [key, value] of queryParams.greaterThan) {
            params = params.append(key + ".greaterThanOrEqual", value);
          }
        }
      }
      if (queryParams.lessThan) {
        for (let [key, value] of queryParams.lessThan) {
          params = params.append(key + ".lessThan", value);
        }
      }
    }
    else {
      let x = 9999;
      params = params.set('size', x.toString());
    }
    return params;
  };
}
