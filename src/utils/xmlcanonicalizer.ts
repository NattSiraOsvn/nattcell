export class XmlCanonicalizer {
  static buildDeterministicXML(root: string, data: unknown): string {
    return `<${root}>${JSON.stringify(data)}</${root}>`;
  }
}
