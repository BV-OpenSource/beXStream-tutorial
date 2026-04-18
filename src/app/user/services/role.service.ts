import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Role } from '../models/role';

@Injectable({
  providedIn: 'root'
})
export class RoleService {

  backendUrl = '/api/v1';

  getAllUrl = this.backendUrl + '/role/all/filtered';

  constructor(private http: HttpClient) { }

  public getAll(): Observable<Role[]> {
    const params = new HttpParams()
            .set('filter', '')
            .set('limit', '0')
            .set('offset', '')
            .set('sort', '')
            .set('order', '');

    return this.http.get<Role[]>(this.getAllUrl,  {params});
  }
}
