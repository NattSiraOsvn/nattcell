export class OfflineService {
  static sync() { localStorage.setItem(key, JSON.stringify(value)); return Promise.resolve(); }
}

export class OfflineService {
  static saveData(key: string, value: any): Promise<void> {
    localStorage.setItem(key, JSON.stringify(value)); return Promise.resolve();
  }
}
