export const SHOWROOM_CONTRACT = {
  cellId: 'showroom-cell', version: '2.0.0',
  emits: ['showroom.appointment.booked','showroom.appointment.completed','showroom.display.updated','showroom.noshow'],
  consumes: ['inventory.item.transferred','customer.registered','sales.initiated'],
} as const;
