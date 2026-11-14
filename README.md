# PickPack 1291 — Quản lý vận hành

Repository public độc lập cho hệ thống quản lý vận hành Pick Pack 1291 (APK + Web).

**Trạng thái:** khởi tạo tài liệu điều hành; chưa có ứng dụng, chưa phát hành Production.

## Bắt đầu mọi phiên AI
1. Đọc [AGENTS.md](AGENTS.md).
2. Thực hiện thứ tự đọc trong [ops/authority.json](ops/authority.json).
3. Đối chiếu [ops/state.json](ops/state.json), [docs/SPEC.md](docs/SPEC.md) và [docs/JOURNAL.md](/tamnv2/pickpack/blob/main/docs/JOURNAL.md).
4. Chỉ chỉnh sửa repository này. Repo khác do Owner sở hữu chỉ được đọc khi Owner yêu cầu.
5. Ghi checkpoint tối thiểu chữ, đầy đủ ý nghĩa; xác minh commit/readback.

**Giới hạn:** Mọi công việc mặc định CODE-ONLY; không phát hành Production hoặc thay đổi tài nguyên provider khi chưa có lệnh riêng của Owner.

**Bảo mật:** Không đưa credentials, token, dữ liệu nhân sự, ảnh chân dung, biên bản, log thật hoặc bí mật cấu hình lên GitHub public.
