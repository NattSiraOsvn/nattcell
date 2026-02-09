/**
 * EVENT VERSIONING - NATT-OS
 * Điều 19: Event Versioning Rules
 */

export type VersionChange = 'MAJOR' | 'MINOR' | 'PATCH';

export interface EventCompatibility {
  backward: boolean;
  breaking: boolean;
  deprecated_after?: string;
}

export interface EventVersionInfo {
  event_type: string;
  version: string;
  change_type: VersionChange;
  compatibility: EventCompatibility;
  changelog?: string;
}

export const EVENT_VERSION_REGISTRY: Record<string, EventVersionInfo> = {
  'config.updated': {
    event_type: 'config.updated',
    version: '1.0.0',
    change_type: 'MAJOR',
    compatibility: { backward: true, breaking: false },
  },
  'rbac.role.assigned': {
    event_type: 'rbac.role.assigned',
    version: '1.0.0',
    change_type: 'MAJOR',
    compatibility: { backward: true, breaking: false },
  },
  'audit.entry.created': {
    event_type: 'audit.entry.created',
    version: '1.0.0',
    change_type: 'MAJOR',
    compatibility: { backward: true, breaking: false },
  },
  'security.threat.detected': {
    event_type: 'security.threat.detected',
    version: '1.0.0',
    change_type: 'MAJOR',
    compatibility: { backward: true, breaking: false },
  },
  'monitor.health.reported': {
    event_type: 'monitor.health.reported',
    version: '1.0.0',
    change_type: 'MAJOR',
    compatibility: { backward: true, breaking: false },
  },
};

export function parseVersion(version: string): [number, number, number] {
  const parts = version.split('.').map(Number);
  return [parts[0] || 0, parts[1] || 0, parts[2] || 0];
}

export function isVersionCompatible(
  producerVersion: string,
  consumerMinVersion: string
): boolean {
  const [pMajor, pMinor] = parseVersion(producerVersion);
  const [cMajor, cMinor] = parseVersion(consumerMinVersion);
  
  if (pMajor !== cMajor) return false;
  if (pMinor < cMinor) return false;
  
  return true;
}

export function isEventDeprecated(eventType: string): boolean {
  const info = EVENT_VERSION_REGISTRY[eventType];
  if (!info?.compatibility.deprecated_after) return false;
  
  const deprecatedDate = new Date(info.compatibility.deprecated_after);
  return new Date() > deprecatedDate;
}
