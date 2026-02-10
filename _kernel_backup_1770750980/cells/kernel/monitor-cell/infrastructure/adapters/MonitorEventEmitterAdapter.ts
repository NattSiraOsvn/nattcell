import { MonitorEventEmitter } from '../../ports/MonitorEventEmitter';

export class MonitorEventEmitterAdapter implements MonitorEventEmitter {
  async emitHealthReported(cellId: string, status: string) {
    console.log('[MONITOR-CELL] monitor.health.reported:', { cellId, status });
  }
  async emitAlertTriggered(alertId: string, cellId: string, type: string) {
    console.log('[MONITOR-CELL] monitor.alert.triggered:', { alertId, cellId, type });
  }
  async emitMetricRecorded(cellId: string, metric: string, value: number) {
    console.log('[MONITOR-CELL] monitor.metric.recorded:', { cellId, metric, value });
  }
}
