import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { PaginatorDto } from 'src/app/lib/models/paginator.dto';
import { Asset } from '../models/asset';
import { Socket, SocketIoConfig } from 'ngx-socket-io';
import { WebStorageService } from '../../lib/web-storage.service';
import { Position } from '../models/position';
import { MavrosState } from '../models/mavrosState';

@Injectable({
  providedIn: 'root'
})
export class AssetService {


  backendUrl = 'https://bexstream.beyond-vision.pt/api/v1/asset';
  // backendUrl = 'https://beyond-skyline-backend.preprod.pdmfc.com/api/v1/asset';
  // backendUrl = 'https://demo.aeriya.tech/api/v1/asset';
  getAllDronesUrl = this.backendUrl + '/all/drone';
  getConfigUrl = this.backendUrl + '/config';

  config: SocketIoConfig = {
    // url: 'https://beyond-skyline-backend.preprod.pdmfc.com',
    url: 'https://bexstream.beyond-vision.pt',
    options: {
      query: {
        source: 'frontend',
        page: 'monitor',
        token: this.webStorage.getStoredToken()
      }
    }
  };
  private socket: Socket = new Socket(this.config);

  constructor(private http: HttpClient, private webStorage: WebStorageService) { }

  public getAllDrones(paginator: PaginatorDto): Observable<Asset[]> {
    const params = new HttpParams()
      .set('filter', paginator.filter)
      .set('limit', paginator.limit.toString())
      .set('offset', paginator.offset.toString())
      .set('sort', paginator.sort)
      .set('order', paginator.order);

    return this.http.get<Asset[]>(this.getAllDronesUrl, { params });
  }

  public initSocket(): Socket {
    this.config.options.query.token = this.webStorage.getStoredToken();
    this.socket.connect();
    return this.socket;
  }

  public closeSocket() {
    this.socket?.disconnect();
  }

  public downloadConfig(id: string): Observable<any> {
    return this.http.get<any>(`${this.getConfigUrl}/${id}`);
}

  public sendSelectedAsset(droneData: any) {
    this.socket.emit('/frontend/selectedAsset', droneData);
  }

  public getAssetPos(assetId: string): Observable<Position> {
    return new Observable<Position>(observer => {
        this.socket.on(assetId + '/position', (data: any) => {
            observer.next({
                latitude: data.x,
                longitude: data.y,
                altitude: data.a
            });
        });
    });
  }

  // Sends Take off
  public sendDroneTakeoff = (droneData: any) => {
    this.socket?.emit('/frontend/takeoff', droneData);
  }

  // Sends Land
  public sendDroneLand = (droneData: any) => {
    this.socket?.emit('/frontend/land', droneData);
  }

  // Sends Velocity Command
  public sendDroneVel = (droneData: any) => {
    this.socket?.emit('/frontend/cmd', droneData);
  }

  

  // Returns STATE of Drone
  public getDroneState = (droneId: string): Observable<MavrosState> => {
    return new Observable<MavrosState>(observer => {
        this.socket?.on(droneId + '/State', (data: MavrosState) => observer.next(data));
    });
  }

}
