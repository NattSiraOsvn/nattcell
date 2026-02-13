# BẢNG TỔNG HỢP CHỈ ĐẠO CHÍNH THỨC

**Mục tiêu:** Cung cấp cho **Bối Bối** một bảng chỉ đạo duy nhất, rõ ràng, không mâu thuẫn, để **viết code chi tiết** và **triển khai script 1‑lệnh Phase A–B–C** cho NATT‑OS Pre‑Wave 3.

---

## I. NGUYÊN TẮC BẤT DI BẤT DỊCH (Áp dụng cho toàn bộ code)

| STT | Nguyên tắc | Nội dung bắt buộc | Người xác nhận |
|---|---|---|---|
| 1 | FILESYSTEM > MEMORY | Mọi kết luận phải dựa trên cây thư mục + git history, không dựa suy đoán | Thiên Lớn |
| 2 | Correct > Fast | Ưu tiên đúng Hiến pháp, chậm cũng được | Kim |
| 3 | Standardize → Automate → Monitor → Improve | Phase A–B là chuẩn hoá, Phase C mới hash & monitor | Băng |
| 4 | Separation of Powers | Script không tự ý quyết định nghiệp vụ | Thiên Lớn |
| 5 | No Silent Fix | Mọi thay đổi phải có log, audit, commit | Kim |

---

## II. QUY ƯỚC KIẾN TRÚC (KHÔNG ĐƯỢC DIỄN GIẢI KHÁC)

| Hạng mục | Quy ước chính thức | Người chốt |
|---|---|---|
| 5‑layer folder | domain / application / interface / infrastructure / ports | Băng |
| 7 lớp ADN | Identity, Capability, Boundary, Trace, Confidence, SmartLink, Lifecycle | Thiên Lớn |
| Quan hệ 5‑layer ↔ 7‑ADN | 5‑layer = implementation anatomy, 7‑ADN = metadata (manifest) | Thiên Lớn |
| Vị trí 7‑ADN | **CHỈ** nằm trong `cell.manifest.json`, KHÔNG tạo folder | Kim |

---

## III. PHASE A — CLEANUP & CHUẨN HOÁ (BẮT BUỘC)

| Việc cần làm | Mô tả chi tiết | Trạng thái | Người chịu trách nhiệm |
|---|---|---|---|
| Xoá legacy ./cells/ | ./cells/ không còn tồn tại | Bắt buộc | Bối Bối |
| Canonical root | `src/cells` là root duy nhất | Bắt buộc | Bối Bối |
| Legacy cells | hr‑cell, event‑cell, sales‑cell, showroom‑cell, constants‑cell → `_legacy/` | Bắt buộc | Bối Bối |
| shared‑kernel | **Rename + migrate** → `infrastructure/shared‑contracts‑cell` | Bắt buộc | Kim |
| shared‑contracts‑cell | Chỉ chứa types, contracts, interfaces (NO logic) | Bắt buộc | Kim |
| Backup | Backup trước mọi thao tác | Bắt buộc | Băng |

---

## IV. PHASE B — WAREHOUSE‑CELL (QUARANTINE)

| Hạng mục | Chỉ đạo chính thức | Người chốt |
|---|---|---|
| Vị trí | `src/cells/infrastructure/warehouse‑cell` | Băng |
| Trạng thái | **QUARANTINED** | Kim |
| Lý do | Chưa hoàn chỉnh domain logic | Thiên Lớn |
| 5‑layer | Có đủ 5 layer (có thể là scaffold) | Băng |
| Import | ❌ Không cell nào được import | Kim |
| Deploy | ❌ Không được deploy | Kim |
| Guard kỹ thuật | Bắt buộc có `throw Error` hoặc `__QUARANTINED__` | Thiên Lớn |

---

## V. PHASE C — AUDIT, HASH, REGISTRY

| Hạng mục | Chỉ đạo | Người chốt |
|---|---|---|
| Registry | Sinh từ filesystem, không hardcode | Thiên Lớn |
| api‑cell | Ghi rõ `NEVER_EXISTED` nếu FS + git không có | Kim |
| Hash | **CHỈ** tạo ở Phase C | Băng |
| Hash scope | Hash sau khi structure ổn định | Băng |
| Validation | Manifest validation có **dry‑run** | Kim |
| Audit | Có PASS / FAIL rõ ràng | Thiên Lớn |

---

## VI. SCRIPT YÊU CẦU KỸ THUẬT (BẮT BUỘC)

| Yêu cầu | Nội dung |
|---|---|
| 1 lệnh chạy | `bash natt‑os‑pre‑wave3.sh` |
| Chạy trên | iMac – natt‑os ver goldmaster |
| Branch | Làm việc trên branch riêng (cleanup/pre‑wave3) |
| Confirm | Có điểm dừng xác nhận giữa Phase A‑B‑C |
| Dry‑run | Có chế độ kiểm tra trước |
| Log | Log file đầy đủ |

---

## VII. NHỮNG ĐIỀU TUYỆT ĐỐI KHÔNG ĐƯỢC LÀM

| Cấm | Lý do | Người chốt |
|---|---|---|
| Tạo folder cho 7‑ADN | Sai Hiến pháp | Thiên Lớn |
| Hash ở Phase A | Hash rác | Băng |
| Dùng warehouse‑cell | Vi phạm quarantine | Kim |
| Đoán cell tồn tại | Phải dựa FS | Thiên Lớn |
| Silent fix | Mất audit | Kim |

---

## VIII. TRẠNG THÁI CHỐT

- Kim: ✅ Đồng ý
- Băng: ✅ Đồng ý
- Thiên Lớn: ✅ Xác nhận Hiến pháp

**=> Bối Bối được phép viết code chi tiết theo bảng này, KHÔNG cần suy diễn thêm.**

