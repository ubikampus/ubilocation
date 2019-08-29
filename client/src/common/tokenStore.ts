export const ADMIN_STORE_ID = 'Ubilocation.AdminToken';
export const BEACON_STORE_ID = 'Ubilocation.BeaconToken';

class TokenStore<T> {
  private storeId: string;
  constructor(storeId: string) {
    this.storeId = storeId;
  }

  get(): T | null {
    const tokenJson = window.localStorage.getItem(this.storeId);
    if (!tokenJson) {
      return null;
    }

    return JSON.parse(tokenJson);
  }

  set(newToken: T): void {
    window.localStorage.setItem(this.storeId, JSON.stringify(newToken));
  }

  clear(): void {
    window.localStorage.removeItem(this.storeId);
  }
}

export default TokenStore;
