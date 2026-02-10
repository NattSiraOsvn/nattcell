export interface MonitorEventEmitter {
  emitHealthReported(cellId: string, status: string): Promise<void>;
  emitAlertTriggered(alertId: string, cellId: string, type: string): Promise<void>;
  emitMetricRecorded(cellId: string, metric: string, value: number): Promise<void>;
}
