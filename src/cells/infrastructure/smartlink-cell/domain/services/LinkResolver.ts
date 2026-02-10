import { SmartLink } from '../entities';

export interface ResolvedLink {
  link: SmartLink;
  depth: number;
  path: string[];
}

export class LinkResolver {
  resolveLinks(links: SmartLink[], startKey: string, maxDepth = 3): ResolvedLink[] {
    const resolved: ResolvedLink[] = [];
    const visited = new Set<string>();

    const traverse = (key: string, depth: number, path: string[]) => {
      if (depth > maxDepth || visited.has(key)) return;
      visited.add(key);

      const relatedLinks = links.filter(l => l.sourceKey === key || l.targetKey === key);
      for (const link of relatedLinks) {
        const nextKey = link.sourceKey === key ? link.targetKey : link.sourceKey;
        resolved.push({ link, depth, path: [...path, nextKey] });
        traverse(nextKey, depth + 1, [...path, nextKey]);
      }
    };

    traverse(startKey, 0, [startKey]);
    return resolved;
  }

  calculateLinkStrength(link: SmartLink, accessCount: number): number {
    // Increase strength based on access frequency
    const boost = Math.min(accessCount * 0.01, 0.3);
    return Math.min(1, link.strength + boost);
  }
}
