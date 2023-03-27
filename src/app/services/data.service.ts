import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient, HttpParams} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(
    private http: HttpClient
  ) {

  }

  public getList(page: number): Observable<any> {
    let queryParams = new HttpParams();
    queryParams = queryParams.append('page', page);
    queryParams = queryParams.append('tags', 'front_page');
    return this.http.get('http://hn.algolia.com/api/v1/search', {params: queryParams});
  }
}
