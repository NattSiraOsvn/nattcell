export class XmlCanonicalizer {
  static canonicalize(xml: string): string { return xml.replace(/\s+/g, " ").trim(); }
  static buildDeterministicXML(root: string, data: unknown): string {
    return `<${root}>${JSON.stringify(data)}</${root}>`;
  }
}
