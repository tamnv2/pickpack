# PickPack 1291 — bản mẫu Web offline

- Mở trực tiếp `index.html` bằng trình duyệt Chrome/Edge, không cần server, tài khoản hay cài thêm thư viện.
- Nhấn **Vào giao diện mẫu** (Admin Demo). Xem 7 mục và thử tìm kiếm, lọc, thêm bản ghi giả. Tải lại trang để khôi phục dữ liệu.
- Đây chỉ là UI review: dữ liệu hoàn toàn giả, không có xác thực/phân quyền, lưu trữ, API, Worker, Firebase, Cloudflare hay Production.
- Không sử dụng cho hoạt động thực tế. Mọi bản ghi trong phiên chỉ tồn tại trong RAM của trang.

Kiểm thử đã thực hiện: Chromium 1366×900 và 390×844, không phát sinh request ngoài trang, không lỗi script; CI chưa chạy.
