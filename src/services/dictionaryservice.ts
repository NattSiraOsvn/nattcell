export class DictService {
  static getInstance(): DictService { return new DictService(); }
  static getVersions(): unknown[] { return []; }
  static rollbackTo(_versionId: string): Promise<void> { return Promise.resolve(); }
}
export default DictService;
