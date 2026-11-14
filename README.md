# PickPack 1291 — Quản lý vận hành

Public repository độc lập cho hệ thống quản lý vận hành Pick Pack 1291 (APK + Web). Thiết kế realtime với tối đa 3 PDA và 5 phiên Web đồng thời.

**Trạng thái:** mới khởi tạo quản trị dự án; chưa có ứng dụng, chưa triển khai Production.

Mỗi phiên AI: đọc [AGENTS.md](AGENTS.md) → [ops/authority.json](ops/authority.json) → [ops/state.json](ops/state.json) → [docs/SPEC.md](docs/SPEC.md) → [docs/JOURNAL.md](docs/JOURNAL.md) → kiểm tra GitHub live nếu cần.

Chỉ repository này được phép sửa. Repo khác của Owner chỉ tham khảo read-only khi Owner yêu cầu. Chia sẻ Firebase Auth/vai trò có thẩm quyền với Inventory, nhưng quyền theo chức năng, Worker và OpsCore PickPack độc lập.

**Mặc định CODE ONLY:** sửa/build/test/báo cáo CODE_READY, không tự merge hoặc phát hành Production. Không ghi secrets, dữ liệu nhân sự, ảnh chân dung, biên bản hay log thật lên GitHub.
