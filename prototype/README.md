# PickPack 1291 — Web Office v0.7

**Phạm vi:** bản Web thử giao diện và quy trình quản lý vận hành, dữ liệu hoàn toàn giả lập. Không có backend, Firebase Auth, kiểm tra quyền ở server, OpsCore hoặc kết nối trực tiếp Google Sheet. **Không nhập thông tin nhân sự, ảnh chân dung hoặc dữ liệu vận hành thật vào bản thử nghiệm công cộng.**

## Truy cập
- Mở `prototype/index.html` trên Chrome/Edge hoặc static host thử nghiệm; đăng nhập **admin / admin** (kiểm thử client-only, không phải xác thực thật).
- Menu là thẻ liên kết HTML thật: có thể chuột phải → mở trong tab mới. Giao diện hỗ trợ light/dark, 90–120% cỡ chữ, desktop và mobile.
- Dữ liệu mô phỏng lưu bằng browser localStorage, không gọi API/Worker/Firebase; các tab cùng origin có thể nhận tín hiệu thay đổi storage.

## Nghiệp vụ được dựng
- **Nhân sự:** trường dữ liệu từ cấu trúc `DANH SÁCH NHÂN SỰ` của Google Sheet Owner tham chiếu: mã NV, họ tên, điện thoại, vị trí chính, nhà cung cấp, bộ phận, site, kho, ngày bắt đầu, ghi chú và dấu vết cập nhật. Bổ sung riêng **ca được phân** và **user làm việc** phục vụ liên kết khi quét. Tạo/sửa hồ sơ và mã nhân viên duy nhất. Thêm, thay hoặc xóa **ảnh đại diện** JPEG/PNG/WebP; trình duyệt thu nhỏ về JPEG 192×192, lưu cục bộ.
- **Ra / vào ca:** vùng quét / nhập mã NV riêng nằm đầu tab. Chọn trước **chế độ Vào ca / Ra ca**, sau đó có thể quét liên tiếp; máy quét gửi Enter sẽ xác nhận đúng chế độ hiện tại. Nhập mã sẽ hiển thị thông tin đầy đủ từ hồ sơ đã lưu. Bấm **Vào ca** (hoặc bắn mã và Enter) / **Ra ca** để ghi thời gian giờ–phút–giây hiện tại cùng ngày, ca được phân và user tương ứng. Chặn mã không tồn tại, chưa phân ca, vào ca trùng hoặc ra ca khi không có lượt đang mở. Lịch sử quét ở chế độ xem và xuất CSV, không chỉnh trạng thái thủ công.
- **PDA:** hiển thị danh mục seri, 5 số cuối, nguồn, trạng thái và ghi chú dựa trên cấu trúc `DANH SÁCH PDA` của Sheet; bên dưới là lịch sử mượn/trả. Có ràng buộc không cho một PDA có hai lượt mượn đang mở.
- Các phân hệ đã duyệt khác: Công nhật, Biên bản, Công cụ dụng cụ và Tổng quan. Dữ liệu mô phỏng cho 36 nhân sự, 42 lượt ca, 42 công nhật, 30 biên bản, 30 CCDC, 30 lượt mượn/trả, 3 PDA giả lập. Tìm kiếm, lọc, xem chi tiết, chỉnh sửa nghiệp vụ mock, xuất CSV; đã loại bỏ nút reset dữ liệu và các thao tác ghi nhận ca bằng tay không phù hợp.

## Phạm vi đồng bộ dữ liệu thật
- Google Sheet tham khảo chỉ đọc; không cập nhật hoặc sao chép dữ liệu của Sheet lên repo public. Tại thời điểm đọc, các hàng được kiểm tra dưới header không có dữ liệu nghiệp vụ; các danh mục chưa có lựa chọn được xác minh.
- Sheet tham khảo **không có mapping mã NV → lịch phân ca → user đang được gán**. Trong bản demo, ca và user nằm trong hồ sơ giả lập để kiểm thử. **Không suy ca từ giờ quét.** Kết nối dữ liệu thật, đồng bộ phân ca, phiên làm việc, xác thực và RBAC phải được thiết kế/duyệt riêng.
- Nhập ảnh thật hoặc thông tin cá nhân trên một bản host công cộng với đăng nhập giả lập có nguy cơ lộ thông tin; chỉ được dùng ảnh và dữ liệu thử nghiệm không nhạy cảm.

## Kiểm thử
```bash
cd prototype
npm run check
npm run build
python tests/browser_smoke.py
python tests/hosted_smoke.py
```
Node >= 18, Playwright/Chromium cho smoke trình duyệt; không có JavaScript dependency tại runtime. `dist/` là thư mục build (untracked).

- **CODE_READY — Web Office v0.7 prototype / CI_PASS:** GitHub Actions [#43584401138](https://github.com/tamnv2/pickpack/actions/runs/43584401138) trên commit `e85b1579fd0ed1e47fc004923abf110849a391a4` PASS: `npm run check`, `npm run build` (7 tệp, 145383 bytes), Chromium smoke (đăng nhập, CRUD, ảnh avatar, quét ca, PDA, theme/font, mobile), và HTTP hosted smoke (đăng nhập chuyển URL, Ctrl+click mở tab, đồng bộ localStorage giữa tab, CSV, quét ca, mobile, không gọi host ngoài).
- **Chưa xác nhận:** máy quét vật lý, hệ thống auth/roles/backend, dữ liệu thật, môi trường field; các cổng `RELEASE_PASS`, `FIELD_PASS`, `OWNER_PASS` không được suy ra từ `CI_PASS`.
- Không merge PR / deploy Web/APK/Worker/Production theo mặc định; chờ lệnh riêng của Owner.
