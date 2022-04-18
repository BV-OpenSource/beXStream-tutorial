import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { PaginatorDto } from 'src/app/lib/models/paginator.dto';
import { Asset } from '../models/asset';

@Injectable({
  providedIn: 'root'
})
export class AssetService {

  backendUrl = 'https://bexstream.beyond-vision.pt/api/v1/asset';
  getAllDronesUrl = this.backendUrl + '/all/drone';

  constructor(private http: HttpClient) {}

  public getAllDrones(paginator: PaginatorDto): Observable<Asset[]> {

    const params = new HttpParams()
      .set('filter', paginator.filter)
      .set('limit', paginator.limit.toString())
      .set('offset', paginator.offset.toString())
      .set('sort', paginator.sort)
      .set('order', paginator.order);

    return this.http.get<Asset[]>(this.getAllDronesUrl, {params});

  }
}
