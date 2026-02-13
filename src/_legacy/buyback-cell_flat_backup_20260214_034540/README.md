# buyback-cell

## Mục đích
Xử lý nghiệp vụ **thu mua vàng cũ, đổi trả, trade-in** — đặc thù ngành trang sức.

## Flow chính
1. **Tiếp nhận** — Khách mang hàng cũ đến
2. **Kiểm định** — Đo tuổi vàng, trọng lượng, kiểm đá, đánh giá tình trạng
3. **Tính giá** — Công thức: `(weight × marketPrice × purity) + stone - depreciation - labor`
4. **Thanh toán** — Trả tiền cho khách hoặc tính bù Trade-in
5. **Phân loại** — RESELL / REFURBISH / SCRAP_GOLD / SCRAP_STONE

## Boundary Rules
- ✅ Giao tiếp qua `shared-contracts-cell` + EDA events
- ❌ KHÔNG import trực tiếp từ business cells khác
- ❌ KHÔNG import kernel / infrastructure

## Events
### Emitted
- `buyback.transaction.created`
- `buyback.inspection.completed`
- `buyback.price.calculated`
- `buyback.payment.completed`
- `buyback.classified`
- `buyback.tradein.initiated`

### Consumed
- `pricing.gold.market.updated`
- `customer.verified`
- `inventory.item.received`
