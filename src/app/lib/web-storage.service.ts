import { Inject, Injectable, InjectionToken } from '@angular/core';
import { StorageService } from 'ngx-webstorage-service';

export const BEXSTREAM_SERVICE_STORAGE =
  new InjectionToken<StorageService>('BEXSTREAM_SERVICE_STORAGE');

const STORAGE_KEY = 'bexstream-token';

@Injectable({
  providedIn: 'root'
})
export class WebStorageService {

  constructor(
    @Inject(BEXSTREAM_SERVICE_STORAGE) private storage: StorageService
  ) { }

  public storageToken(token: string): void {
    this.storage.set(STORAGE_KEY, token);
  }

  public getStoredToken(): string {
    return this.storage.get(STORAGE_KEY);
  }

  public removeStoredToken(): void {
    this.storage.remove(STORAGE_KEY);
  }

  public clearLocalStorage(): void {
    this.storage.clear();
  }
}
