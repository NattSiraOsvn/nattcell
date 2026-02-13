# INVENTORY-CELL UNIT TEST SPECIFICATIONS

## Test Suite 1: Availability Rules
1. **TC-001:** Check món `AVAILABLE` -> Trả về `true`.
2. **TC-002:** Check món `RESERVED` -> Trả về `false`, reason="Reserved by Customer X".
3. **TC-003:** Check món `SOLD` -> Trả về `false`.
4. **TC-004:** Check món `MAINTENANCE` -> Trả về `false`, reason="In Service".

## Test Suite 2: Reservation Flow
1. **TC-005 (Success):** Gửi lệnh Reserve hợp lệ -> Status chuyển thành `RESERVED` -> Emit Event `INVENTORY.RESERVED`.
2. **TC-006 (Conflict):** Cố Reserve món đã bị người khác cọc -> Throw Error "Item Locked".
3. **TC-007 (Timeout):** Giả lập quá 24h -> Status tự động quay về `AVAILABLE`.

## Test Suite 3: Deduct Flow
1. **TC-008 (Sales):** Lệnh Deduct từ Order hợp lệ -> Status chuyển thành `SOLD` -> Emit Event `INVENTORY.SOLD`.
