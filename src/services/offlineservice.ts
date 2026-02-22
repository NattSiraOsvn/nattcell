export class OfflineService {
  static sync() {
    return Promise.resolve();
  }

  static saveData(key: string, value: any): Promise<void> {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    }
  }
}
