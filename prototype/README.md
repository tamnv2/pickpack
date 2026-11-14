# PickPack 1291 — UI architecture review v0.3

**Chỉ giao diện thử nghiệm:** 5 bố cục khác nhau cho cùng 7 mô-đun. Không liên quan Firebase Auth, Inventory user/role, Worker, OpsCore, dữ liệu thực, realtime hay APK. Không dùng làm Production.

## Chạy mẫu / build

- Mở `index.html` trên Chrome hoặc Edge, chọn mẫu **Sáng/Tối**. Mỗi mẫu mở tab trình duyệt riêng.
- Có thể mở trực tiếp từng URL tương đối: `app.html?design=1&mode=dark&page=people` (design 1–5, mode light/dark, page overview/people/shifts/labor/minutes/assets/pda).
- Chọn “Mở tab mới”, nút mở cạnh navigation hoặc dòng dữ liệu để mở độc lập. Các đường dẫn là anchor HTML thực với `target="_blank"` và `rel="noopener noreferrer"`.
- `npm run check` để rà soát source tĩnh; `npm run build` sao chép 4 asset tĩnh vào `dist/`. Không cài dependency, Node >=18. Chạy offline trực tiếp từ `dist/index.html`.
- Các hành động demo (tìm kiếm, lọc, thêm bản ghi) chỉ có hiệu lực trong RAM tab hiện tại. Tải lại trang để khôi phục dữ liệu mẫu. **Không có đăng nhập thật** — chỉ hiển thị `Admin Demo`.

## Năm kiến trúc khác nhau

1. **Điều hành tổng hợp:** sidebar dọc + KPI + biểu đồ + nhật ký, trang dữ liệu dạng bảng.
2. **Trung tâm giám sát:** điều hướng ngang + số liệu lớn + dải hoạt động + cảnh báo ưu tiên + timeline.
3. **Luồng công việc:** navbar trạng thái + kanban 3 cột; module dữ liệu cũng phân theo luồng thẻ.
4. **Bàn dữ liệu:** rail icon + ribbon + bảng dữ liệu chiếm ưu thế + panel kiểm tra bên phải.
5. **Trạm tác nghiệp:** mobile-first + thao tác quét lớn + thẻ shortcut và dock dưới; module dạng thẻ hồ sơ.

Mỗi kiến trúc được xây riêng bằng HTML/CSS/JavaScript, không chỉ đổi màu hoặc font. Cả 5 có sáng/tối, responsive và deep links; không sao chép mã của uupm.cc. Tham khảo các nguyên tắc thiết kế, không dùng thư viện runtime ngoài.

## Kiểm chứng

- `npm run check` và `npm run build`: PASS.
- Chromium headless: 1440×900 + 390×844; đủ 5×2 giao diện, 7 module, deep-link, search/filter/add/reset, xác nhận anchor đa tab (`target=_blank`, `rel=noopener noreferrer`), JS không lỗi, không request ngoài: PASS.
- **Giới hạn môi trường:** Chromium sandbox tại đây chặn mọi `file://`/`127.0.0.1` navigation. Không thể xác nhận bằng click một cửa sổ popup thật trong môi trường này. Cần kiểm tra tay hành động mở tab bằng Chrome/Edge trên máy Owner.
- Không có CI chạy, không có Owner/Field/Release PASS.
