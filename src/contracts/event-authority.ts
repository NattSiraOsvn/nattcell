/**
 * EVENT AUTHORITY - NATT-OS
 * Điều 18: Event Authority - Chỉ cell được khai báo authoritative mới được phát event
 */

export interface EventAuthorityRule {
  cell_id: string;
  event_patterns: string[];
  delegation_allowed: boolean;
}

export const EVENT_AUTHORITY_REGISTRY: EventAuthorityRule[] = [
  {
    cell_id: 'cell:config',
    event_patterns: ['config.*'],
    delegation_allowed: false,
  },
  {
    cell_id: 'cell:rbac',
    event_patterns: ['rbac.*'],
    delegation_allowed: false,
  },
  {
    cell_id: 'cell:monitor',
    event_patterns: ['monitor.*'],
    delegation_allowed: false,
  },
  {
    cell_id: 'cell:audit',
    event_patterns: ['audit.*'],
    delegation_allowed: false,
  },
  {
    cell_id: 'cell:security',
    event_patterns: ['security.*'],
    delegation_allowed: false,
  },
  {
    cell_id: 'cell:omega',
    event_patterns: ['system.recovery.*', 'omega.*'],
    delegation_allowed: true,
  },
];

export type AuthorityViolation = {
  type: 'CONSTITUTIONAL_VIOLATION';
  cell_id: string;
  event_type: string;
  message: string;
};

export function hasEventAuthority(cellId: string, eventType: string): boolean {
  const rule = EVENT_AUTHORITY_REGISTRY.find(r => r.cell_id === cellId);
  if (!rule) return false;
  
  return rule.event_patterns.some(pattern => {
    if (pattern.endsWith('.*')) {
      const prefix = pattern.slice(0, -2);
      return eventType.startsWith(prefix + '.');
    }
    return pattern === eventType;
  });
}

export function validateEventAuthority(
  cellId: string,
  eventType: string
): AuthorityViolation | null {
  if (hasEventAuthority(cellId, eventType)) {
    return null;
  }
  
  return {
    type: 'CONSTITUTIONAL_VIOLATION',
    cell_id: cellId,
    event_type: eventType,
    message: `Cell ${cellId} không có quyền phát event ${eventType}`,
  };
}

export function getAuthorizedCell(eventType: string): string | null {
  for (const rule of EVENT_AUTHORITY_REGISTRY) {
    const matches = rule.event_patterns.some(pattern => {
      if (pattern.endsWith('.*')) {
        const prefix = pattern.slice(0, -2);
        return eventType.startsWith(prefix + '.');
      }
      return pattern === eventType;
    });
    if (matches) return rule.cell_id;
  }
  return null;
}
