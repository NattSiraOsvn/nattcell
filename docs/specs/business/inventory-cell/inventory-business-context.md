# INVENTORY-CELL BUSINESS CONTEXT
**Domain:** High-Value Asset Management (Tâm Luxury)
**Status:** WAVE 3 ACTIVE

## 1. Định nghĩa Hàng Hóa (Context Việt Nam)
* **Quản lý đơn chiếc (Serialized Item):** Áp dụng cho Đồng hồ, Túi hiệu, Kim cương viên. Mỗi món có 1 Serial Number duy nhất.
* **Quản lý định lượng (Quantitative Item):** (Ít dùng, dự phòng) Cho vàng nhẫn trơn, dây chuyền máy.

## 2. Quy trình Nghiệp vụ Cốt lõi
1. **Giữ hàng (Reservation/Cọc):**
   - Khách cọc -> Hàng chuyển trạng thái `RESERVED`.
   - Giữ trong 24h. Nếu không thanh toán -> Auto release về `AVAILABLE`.
2. **Xuất bán (Deduct):**
   - Đơn hoàn tất -> Hàng chuyển trạng thái `SOLD`.
   - Ghi nhận doanh thu và giá vốn tại thời điểm xuất.
3. **Thu đổi (Buyback):**
   - Nhập lại hàng cũ -> Kiểm định -> Nhập kho với giá mới.

## 3. Ràng buộc Hiến pháp (Boundary)
* Inventory KHÔNG được gọi trực tiếp sang Sales (tránh vòng lặp).
* Sales gọi Inventory qua Interface `IInventoryPort`.
