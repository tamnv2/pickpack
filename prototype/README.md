# PickPack 1291 — Horilla-inspired UI v0.4

**Mục tiêu:** xem và duyệt giao diện Web dành riêng cho Pick Pack 1291. Tham khảo mẫu UI công khai của Horilla (https://hr.demo.horilla.com/login/, https://www.horilla.com, https://docs.horilla.com), nhưng tự xây dựng mã, bố cục cụ thể, nhãn và hình ảnh riêng; không sao chép hoặc nhập mã nguồn/assets Horilla. Chưa truy cập được phiên đăng nhập bên trong demo, vì môi trường kiểm tra không hỗ trợ thao tác login trang bên ngoài.

## Chạy bản mẫu
- Mở `index.html` trong Chrome/Edge, chọn **Admin Demo** (không cần mật khẩu).
- Menu trái gồm Tổng quan, Nhân sự, Ra/vào ca, Công nhật, Biên bản, Công cụ dụng cụ, Mượn/trả PDA.
- Điều hướng thường mở trong tab hiện tại; chọn biểu tượng `↗` bên cạnh menu hoặc nút “Tab mới” để mở cửa sổ/tab mới với URL độc lập, ví dụ: `app.html?view=people&theme=light`.
- Nhấn dòng dữ liệu để mở panel chi tiết; nhấn `↗` trong dòng để mở bản ghi ở tab mới; tìm kiếm, lọc, đổi kiểu bảng/thẻ, chuyển sáng/tối và thêm bản ghi giả lập.
- Để build: `npm run check && npm run build` (Node >=18; không cài dependency). Mở `dist/index.html` sau build.

## Ranh giới
- Toàn bộ nhân sự, user, thiết bị, giờ công là giả lập; dùng `example.invalid` cho các địa chỉ giả.
- Admin Demo không xác thực và không liên quan tài khoản/UID/vai trò của Inventory.
- Không API, Firebase, Worker, OpsCore, lưu trữ, realtime, APK hay dữ liệu Production. Thao tác không tồn tại sau khi tải lại tab. Không nhập dữ liệu cá nhân thật.
- Chưa phát hành công khai; chỉ source và kiểm thử trên nhánh/PR chờ Owner duyệt.
- Mục tiêu khi Owner chốt giao diện là dùng thiết kế này để xây dựng nghiệp vụ, API và backend thật sau phê duyệt; không xem UI-only là ứng dụng Production.
