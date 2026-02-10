# warranty-cell

## Mục đích
Xử lý **bảo hành trọn đời và dịch vụ sửa chữa** trang sức — đặc thù Tâm Luxury.

## Flow chính
1. **Tiếp nhận** — Khách mang sản phẩm cần bảo hành/sửa chữa
2. **Chẩn đoán** — Xác định lỗi, đề xuất dịch vụ
3. **Báo giá** — Tự động tính theo policy: VIP tier, mua tại shop, loại dịch vụ
4. **Thực hiện** — Xi, mạ, hàn, gắn đá, resize...
5. **Kiểm tra** — Quality check trước khi trả
6. **Trả hàng** — Thông báo khách nhận

## Chính sách phí
| Policy | Điều kiện | Giảm |
|--------|-----------|------|
| FREE_LIFETIME | Mua tại shop + dịch vụ cơ bản | 100% |
| FREE_VIP | VIP Gold/Platinum/Diamond | 100% (theo tier) |
| DISCOUNTED | Mua tại shop + dịch vụ nâng cao | 50% |
| FULL_PRICE | Hàng ngoài | 0% |

## Dịch vụ
POLISH, REPLATE, RESIZE, STONE_RESET, STONE_REPLACE, SOLDER, CLASP_REPLACE, ENGRAVING, FULL_RESTORATION, CLEANING

## Boundary Rules
- ✅ Giao tiếp qua `shared-contracts-cell` + EDA events
- ❌ KHÔNG import trực tiếp từ business cells khác
