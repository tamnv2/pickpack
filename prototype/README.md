# PickPack 1291 — Web Office v0.6

**Phạm vi:** bản thử giao diện và quy trình quản trị bằng dữ liệu tổng hợp. Chưa có backend, xác thực Firebase, quyền nghiệp vụ server, OpsCore hay Production. Không được nhập thông tin nhân sự, thiết bị, biên bản thật.

## Truy cập và thao tác
- Mở `index.html` trên Chrome/Edge (hoặc dùng static server của riêng người kiểm thử); đăng nhập **admin / admin**. Tài khoản này **chỉ là điều kiện kiểm thử trong JavaScript**, không phải tài khoản quản trị thực.
- Có 7 phân hệ: tổng quan, nhân sự, ra/vào ca, công nhật, biên bản, CCDC, mượn/trả PDA.
- Các danh sách hỗ trợ xem chi tiết, tạo/sửa/xóa, xóa nhiều, tìm kiếm, lọc trạng thái, dạng bảng/thẻ, xuất CSV và khôi phục dữ liệu gốc. Thao tác nhanh cập nhật trạng thái, có ràng buộc không cho một PDA xuất hiện trong 2 lượt mượn mở.
- Biểu tượng được vẽ dạng SVG theo nghiệp vụ. Menu ghim bên trái đổi màu đồng nhất theo chế độ sáng/tối. Cài đặt tăng/giảm cỡ chữ 90–120% theo bước 5%, ghi nhớ trên trình duyệt. Thông báo tập hợp các mục chờ xử lý từ dữ liệu hiện có.
- Các mục menu và tên hồ sơ là liên kết `<a href>` thật: chuột phải → Mở liên kết trong tab mới. Không có nút tạo tab.
- Giao diện cố ý không chứa nội dung trao đổi AI–Owner hoặc hướng dẫn kỹ thuật. Thông tin an toàn chỉ ghi trong tài liệu này.

## Bộ dữ liệu tự tạo
- 36 nhân sự, 42 lượt ra/vào, 42 dòng công nhật, 30 biên bản, 30 CCDC, 30 lịch sử mượn/trả trên 3 mã PDA. Tên, mã, user, ngày, trạng thái là **dữ liệu tổng hợp do thuật toán sinh**, không lấy từ nghiệp vụ thật.
- `localStorage` lưu các chỉnh sửa và cài đặt trên một trình duyệt, có tín hiệu đồng bộ giữa các tab cùng origin. Có thể nhấn **Khôi phục** để tạo lại bộ dữ liệu cố định.
- Khi mở qua `file://`, chuyển tab dùng tham số demo nội bộ do mỗi tệp có thể bị trình duyệt cách ly localStorage. Đây không phải tính năng bảo mật.
- Trên preview bên thứ ba, **không nhập dữ liệu thật**: URL/CDN công cộng không phải môi trường riêng tư hay hệ thống chính thức.

## Kiểm chứng
```bash
cd prototype
npm run check
npm run build
python tests/browser_smoke.py
```
Yêu cầu Node ≥18, Playwright/Chromium cho bài kiểm thử trình duyệt. Không cài thư viện JavaScript tại runtime. Bảy tệp tĩnh thuộc thư mục `dist/` khi build.

- Đã xác nhận mã JavaScript biên dịch trong V8; 16 phép thử render/structure, 6 phép thử hành vi ở môi trường DOM giả lập (font, theme, CRUD và chặn PDA trùng) PASS.
- **Chưa chạy build và Chromium end-to-end trong phiên v0.6**; `CI_PASS`, điều hướng browser thật, download CSV, đồng bộ hai tab, hiển thị ở nhiều kích thước màn hình và `FIELD_PASS` **chưa xác nhận**.
- Toàn bộ thông tin đăng nhập và thao tác quản trị chỉ có ở client. Bản này không được dùng để kiểm soát dữ liệu thật hoặc cấp quyền thực.
