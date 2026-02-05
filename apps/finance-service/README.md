
# 🏛️ FINANCE SERVICE – NATT-OS INTERNAL CORE

## ⚖️ TUYÊN NGÔN PHÁP LÝ
Service này là "Sự thật duy nhất" (Single Source of Truth) về tiền và tài sản của hệ thống. Mọi sai lệch tại đây sẽ dẫn đến rủi ro pháp lý trực tiếp cho doanh nghiệp.

## 🛡️ NGUYÊN TẮC NIÊM PHONG (DATA SEALING)
1. **Append-Only**: Nhật ký Audit không có lệnh DELETE hay UPDATE.
2. **Deterministic Hashing**: Mọi trạng thái cuối của Invoice/Payment phải được băm Shard Hash trước khi chuyển trạng thái.
3. **Idempotency**: Chặn tuyệt đối việc xử lý trùng lặp giao dịch thông qua `event_id` và `idempotency_key`.

## 👤 TRÁCH NHIỆM NHÂN SỰ
- **Domain logic**: Được bảo trợ bởi `CAN`.
- **Hệ thần kinh (Messaging)**: Vận hành bởi `PHIÊU`.
- **Kiểm soát tuân thủ**: Thực thi bởi `KRIS`.
- **Niêm phong & Hậu kiểm**: Giám sát bởi `THIÊN NHỎ`.

## 🚨 QUY TRÌNH KHẨN CẤP
Trong trường hợp phát hiện rò rỉ dữ liệu tài chính (Hash Mismatch):
1. Kích hoạt `OMEGA_LOCKDOWN`.
2. Trích xuất Shard Backup từ Cold Storage.
3. Replay Event Store để khôi phục trạng thái.

**Duyệt bởi Gatekeeper – 2026.V1**
