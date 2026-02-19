import { CellContract } from '../domain/contract.types';

export class ContractRegistry {
  private contracts: CellContract<any, any>[] = [];

  register(contract: CellContract<any, any>) {
    this.contracts.push(contract);
  }

  enforceTopology() {
    const allEmits = new Set(
      this.contracts.flatMap(c => c.emits)
    );

    for (const contract of this.contracts) {
      for (const topic of contract.consumes) {
        if (topic === '*') continue;
        if (!allEmits.has(topic)) {
          throw new Error(
            `Topology violation: ${contract.cellId} consumes orphan event '${topic}'`
          );
        }
      }
    }
  }
}
