# PickPack 1291 · 5 phương án giao diện web

**UI REVIEW — KHÔNG ĐƯỢC DÙNG CHO VẬN HÀNH THẬT.** Dữ liệu giả, Admin Demo không phải xác thực, chưa có phân quyền backend, không Firebase, OpsCore, API, Worker hay realtime.

## Dùng ngay (offline)

Mở `index.html` trong Chrome/Edge, chọn 1 trong 5 mẫu và **Xem sáng** hoặc **Xem tối**. Mỗi lựa chọn mở trong tab mới. Trong giao diện, nhấn `↗` bên cạnh các mục, **Mở tab mới**, hoặc `Ctrl+Click` để mở nhiều tab browser độc lập. Mỗi tab nhận `design`, `mode` và `page` trên URL; mở trực tiếp URL cũng hoạt động. Không cần cài đặt, Internet hoặc đăng nhập.

## Build ra file tĩnh có thể host khi Owner duyệt triển khai

Yêu cầu Node.js 18+ (chỉ để build, không cần cho người dùng):

```bash
npm run check
npm run build
```

Kết quả ở `dist/`: `index.html`, `app.html`, `assets/styles.css`, `assets/app.js`. Không có dependency npm, bundle ngoài hay giao tiếp mạng. `dist/` tương thích web static hosting, nhưng **chưa được phép triển khai lên provider hoặc Production**.

## Phương án

1. Điều hành — sidebar nghiệp vụ; 2. Không gian mở — thanh ngang; 3. Trung tâm kiểm soát — dashboard đặc; 4. Thẻ nghiệp vụ — rail bo mềm; 5. Command Studio — rail nổi. Cả 5 có sáng/tối, 7 mục nghiệp vụ dùng chung, lọc/tìm kiếm/thêm bản ghi giả trong RAM. Mở từng bản ghi ở tab khác nhưng dữ liệu thêm mới **không tự đồng bộ giữa tab** vì chưa có backend; đây là giới hạn có chủ đích của giai đoạn UI.
