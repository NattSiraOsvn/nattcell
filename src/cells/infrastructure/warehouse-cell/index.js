// WAREHOUSE CELL - QUARANTINED
// DO NOT USE THIS CELL

export const CELL_STATUS = "QUARANTINED";

export class WarehouseCellQuarantineError extends Error {
    constructor() {
        super("WAREHOUSE_CELL_QUARANTINED: Access to quarantined warehouse-cell is prohibited.");
        this.name = "ConstitutionalViolation";
    }
}

// Luôn throw khi được import
throw new WarehouseCellQuarantineError();

export default function() {
    throw new WarehouseCellQuarantineError();
}
