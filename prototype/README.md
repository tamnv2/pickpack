# PickPack 1291 — Horilla-style Admin Demo UI v0.5

**Giai đoạn:** bản Web offline để Owner kiểm thử giao diện, chưa có backend, Firebase Auth, quyền thực tế, OpsCore, Worker hay Production. Chỉ sửa `tamnv2/pickpack`.

## Chạy thử

1. Mở `index.html` bằng Chrome/Edge, đăng nhập `admin` / `admin` (chỉ có hiệu lực trong giao diện demo, không phải tài khoản thực).
2. Dùng menu 7 phân hệ, tìm kiếm, lọc, tạo/sửa/xóa, xóa hàng loạt, xem hồ sơ, chuyển bảng/thẻ, xuất CSV, đặt lại dữ liệu giả và đổi trạng thái minh họa. Đăng xuất từ menu trái.
3. Để mở tab mới theo cách trình duyệt: **nhấn chuột phải vào tên chức năng hoặc tên bản ghi → Mở liên kết trong tab mới**, hoặc Ctrl+click / click chuột giữa. Không có nút tạo tab mới.
4. Đổi sáng/tối ở góc trên phải; giao diện có responsive desktop/mobile, chuyển động nhẹ và tuân thủ reduced-motion.
5. Nếu mở trực tiếp bằng `file://`, demo dùng tham số `demo=1` nhằm chuyển giữa các trang khi localStorage không được trình duyệt chia sẻ cho các tệp local; **đây không phải bảo mật**. Để xác nhận đồng bộ giữa nhiều tab, nên mở qua static HTTP origin khi kiểm thử cục bộ.

## Dữ liệu giả lập

- Nhân sự **36**; ra/vào ca **42**; công nhật **42**; biên bản **30**; CCDC **30**; lịch sử mượn/trả PDA **30** dòng, với **3 mã thiết bị mẫu**.
- Tên, user, mã, tình trạng, thời điểm đều **do phần mềm sinh giả lập, có tính thực tế về hình thức**, không phải thông tin nhân viên hoặc thiết bị có thật.
- Thay đổi dữ liệu được lưu `localStorage` trên trình duyệt nếu có hỗ trợ, đồng bộ sang tab khác của cùng origin; làm mới dữ liệu bằng nút **Đặt lại**. Tuyệt đối không nhập dữ liệu thật.

## Biểu tượng

- Ảnh logo người dùng cung cấp được chuyển thành `assets/supra-mark.png` và `assets/favicon.png`/`favicon.ico`. Các tệp chỉ dùng nội bộ trong bản Web demo.

## Build/kiểm thử

```bash
npm run check
npm run build
```

- Node ≥18, không cài package, 7 static assets nằm trong `dist/`.
- Kết quả kiểm thử: Node syntax + source check + build PASS; Chromium inline DOM smoke desktop/mobile PASS các thao tác nhập sai login, hiển thị/ẩn mật khẩu, bảng/số bản ghi ở 6 phân hệ, tạo/sửa/xóa, lọc, bulk, reset, drawer, đổi trạng thái, theme và đường dẫn menu là anchor gốc.
- **Giới hạn:** trình duyệt tự động trong môi trường kiểm thử không thể điều hướng đến `file://` hoặc `localhost` do chính sách sandbox; chưa thể khẳng định end-to-end login redirect, context-menu new-tab, CSV tải xuống, đồng bộ qua hai tab trên Chrome/Edge thật. Cần kiểm thử trực tiếp trước khi chấp nhận FIELD_PASS.
- Login mẫu JavaScript và quản trị dữ liệu mẫu **không cung cấp quyền truy cập hay bảo mật backend**. Không deploy bản này ra URL public/Production.
