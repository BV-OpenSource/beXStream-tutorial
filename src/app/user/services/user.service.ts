import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PaginatorDto } from 'src/app/lib/models/paginator.dto';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  backendUserUrl = 'https://bexstream.beyond-vision.pt/api/v1/user';

  constructor(private http: HttpClient) { }

  public getAllUsers(paginator: PaginatorDto): Observable<User[]> {
    const params = new HttpParams()
      .set('filter', paginator.filter)
      .set('limit', paginator.limit.toString())
      .set('offset', paginator.offset.toString())
      .set('sort', paginator.sort)
      .set('order', paginator.order);

    return this.http.get<User[]>(this.backendUserUrl, {params});
  }

  public register(user: User): Observable<User> {
    return this.http.put<User>(this.backendUserUrl, user);
  }

  public update(user: User): Observable<User> {
    return this.http.post<User>(`${this.backendUserUrl}/${user.id}`, user);
  }

  public delete(user: User): Observable<User> {
    return this.http.delete<User>(`${this.backendUserUrl}/${user.id}`);
  }
}
