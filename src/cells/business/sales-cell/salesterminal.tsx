/**
 * SaleTerminal — re-export alias
 * Components import from @/cells/sales-cell/salesterminal
 * Actual implementation in application/services/sales.service.ts
 */
import React from 'react';

interface SaleTerminalProps {
  [key: string]: unknown;
}

export default function SaleTerminal(_props: SaleTerminalProps) {
  return React.createElement('div', { className: 'sale-terminal' }, 'SaleTerminal');
}
