import { HealthReport } from '../entities';

export class HealthAnalyzer {
  analyzeSystem(reports: HealthReport[]): { overallStatus: 'HEALTHY' | 'DEGRADED' | 'UNHEALTHY'; unhealthyCells: string[] } {
    const unhealthyCells = reports.filter(r => r.status === 'UNHEALTHY').map(r => r.cellId);
    const degradedCells = reports.filter(r => r.status === 'DEGRADED').map(r => r.cellId);

    let overallStatus: 'HEALTHY' | 'DEGRADED' | 'UNHEALTHY' = 'HEALTHY';
    if (unhealthyCells.length > 0) overallStatus = 'UNHEALTHY';
    else if (degradedCells.length > 0) overallStatus = 'DEGRADED';

    return { overallStatus, unhealthyCells };
  }
}
