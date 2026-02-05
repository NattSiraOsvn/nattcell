📜 PHỤ LỤC HIẾN PHÁP NATT-OS
STATE-BASED ROADLOAD – NATTCELL KERNEL (FULL – OFFICIAL)

Mã văn bản: NATT-OS-CONST-APPX-ROADLOAD-001
Tính chất: Hiến định – Bắt buộc tuân thủ
Hiệu lực: Khi được Gatekeeper cấp SiraSign hợp lệ
Phạm vi áp dụng: Toàn bộ NATT-OS – mọi Kernel – mọi Cell – mọi AI – mọi cá nhân tham gia hệ thống

I. NGUYÊN TẮC NỀN TẢNG
Điều 1. Bản chất của Roadload

Roadload này không phải timeline, không phải roadmap, không phải kế hoạch tiến độ, không phải công cụ quản lý thời gian.

Roadload chỉ mô tả các trạng thái tồn tại hợp hiến (State) của hệ thống NATT-OS tại từng thời điểm, dùng để xác định:

Hệ thống đang ở trạng thái nào,

Trạng thái đó có hợp hiến hay không,

Và có đủ điều kiện tồn tại hoặc chuyển tiếp hay không.

Điều 2. Phân biệt State – Phase – Roadmap

State: trạng thái tồn tại hợp hiến của hệ thống.

Phase: khái niệm triển khai kỹ thuật (không có giá trị hiến định).

Roadmap: công cụ kế hoạch (không có giá trị hiến định).

NATT-OS chỉ công nhận State, và không công nhận Phase hay Roadmap như căn cứ vận hành.

II. CHUỖI TRẠNG THÁI HIẾN ĐỊNH (STATE PROGRESSION)

Hệ thống NATT-OS được công nhận tồn tại hợp hiến chỉ khi nằm trong một trong các State sau:

STATE 1 – CONSTITUTIONAL_FOUNDATION_ESTABLISHED

Hệ thống đã có:

Hiến pháp NATT-OS hợp lệ,

Roadload hiến định,

Gatekeeper tồn tại về mặt cấu trúc.

⭣ (Yêu cầu Gatekeeper SiraSign để xác nhận State)

STATE 2 – KERNEL_CORE_BARE_METAL

Kernel tồn tại độc lập, không bị UI, Service hay con người chi phối.

Exit State: STABLE

STATE 3 – CELL_RUNTIME_OPERATIONAL

Các Cell được phép hoạt động trong giới hạn hiến định.
Hệ thống có thể quan sát được hành vi, nhưng chưa khẳng định sự thật.

Exit State: OBSERVABLE

STATE 4 – MEMORY_TRUTH_AUDIT_ACTIVE

Hệ thống kích hoạt cơ chế:

AuditTrail bất biến,

EventStore append-only,

Không cho phép chỉnh sửa quá khứ.

Exit State: FORENSIC_READY

STATE 5 – OMEGA_RECOVERY_ENABLED

Hệ thống có khả năng:

Phát hiện sai lệch,

Khoanh vùng,

Phục hồi có điều kiện,

Không xóa lịch sử.

Exit State: SELF_HEALING

STATE 6 – GOVERNANCE_LAW_ENGINE_ACTIVE

Luật không chỉ tồn tại trên giấy, mà được thực thi thật thông qua:

Gatekeeper,

RBAC,

Audit,

Phán quyết YES / NO.

Exit State: SOVEREIGN

STATE 7 – AI_HUMAN_CO_EXISTENCE

Con người và AI cùng tồn tại trong hệ thống:

Có kiểm soát,

Có truy cứu trách nhiệm,

Có ranh giới hiến định rõ ràng.

Exit State: CO_EVOLUTION

III. NGUYÊN TẮC CHUYỂN TRẠNG THÁI (STATE TRANSITION)
Điều 3. Điều kiện bắt buộc để chuyển State

Một State chỉ được phép chuyển sang State liền kề tiếp theo khi đồng thời thỏa mãn toàn bộ:

Hoàn thành đầy đủ Exit Criteria của State hiện tại.

Được Gatekeeper cấp SiraSign hợp lệ cho phép chuyển State.

Vượt qua Constitutional Compliance Check.

Được xác nhận Business Truth Context, được hiểu là:

Phù hợp với dữ liệu thực tế, pháp luật Việt Nam hiện hành,
có chứng từ kiểm chứng được,
không phụ thuộc ý kiến cá nhân, cảm tính hay áp lực bên ngoài.

Đạt trạng thái Production-Ready theo Hiến pháp, nghĩa là:

Có Gatekeeper kiểm soát – Có AuditTrail – Có Event bất biến – Có khả năng truy vết trách nhiệm.

Điều 4. State Transition là Event bất biến

Mọi State Transition bắt buộc:

Phát sinh Event bất biến,

Ghi vào EventStore,

Ghi vào AuditTrail.

Không có Event → coi như State Transition chưa từng xảy ra, dù có bất kỳ xác nhận nào khác.

Điều 4.1. Cấm nhảy State (Điều khoản khóa tuyệt đối)

NATT-OS tuyệt đối cấm:

Bỏ qua State,

Nhảy cóc State,

Kích hoạt State cao hơn khi chưa đạt State liền kề.

Mọi hành vi nhảy State bị coi là vi hiến nghiêm trọng và bắt buộc ghi vĩnh viễn vào AuditTrail, không được xóa.

IV. GOVERNANCE KERNEL – CELL 005 (KIM)
Điều 5. Quyền hạn duy nhất

CELL 005 (Governance Kernel) chỉ có quyền:

Xác nhận một State có hợp hiến hay không (YES / NO).

Xác nhận một State Transition có được phép hay không (YES / NO).

Điều 6. Những điều Governance bị cấm tuyệt đối

CELL 005 tuyệt đối không được:

Can thiệp implementation detail.

Chỉ đạo cách Kernel Architect xây kernel.

Áp đặt tiến độ, deliverables, KPI hay timeline trá hình.

Tự ý kích hoạt Cell hoặc State.

Governance ≠ Architecture.
Governance chỉ xét Luật, không xét Cách làm.

V. QUY ĐỊNH THEO TỪNG CELL
CELL 001 – SECURITY AUDIT

Phát hiện vi phạm.

Không can thiệp kernel logic.

CELL 002 – UI / UX TERMINAL

UI chỉ được emit intent-event.

Cấm trigger kernel command trực tiếp.

Cấm bypass PermissionGate.

CELL 003 – ANALYTICS CORE

Chỉ đọc từ EventStore & StateSnapshot.

Cấm tạo sự kiện điều khiển hệ thống.

CELL 004 – REHABILITATION ENGINE

Không xóa lịch sử.

Chỉ khôi phục có điều kiện.

Tái phạm → auto-kill theo Hiến pháp.

CELL 005 – GOVERNANCE KERNEL

Chỉ giám sát, xác nhận, phán quyết hợp hiến.

Không điều hành, không triển khai.

VI. NGUYÊN TẮC SONG SONG

Các Cell được phép thiết kế song song.

Cấm tích hợp khi Kernel chưa đạt State tương thích.

Cấm phát production event ngoài Kernel khi chưa được phép.

VII. ĐIỀU KHOẢN TỐI THƯỢNG

Phụ lục này không override Hiến pháp NATT-OS, mà là phần mở rộng hiến định.

Mọi hành động không có explicit command + SiraSign hợp lệ đều vô hiệu.

Business Truth luôn đứng trên Technical Elegance.

Vi phạm Hiến pháp → ghi vĩnh viễn vào AuditTrail, không được xóa.

🔒 KẾT THÚC PHỤ LỤC HIẾN ĐỊNH
