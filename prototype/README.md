# PickPack 1291 — Web Office v0.8

**Phạm vi:** Web prototype tĩnh, bản ghi hoàn toàn giả lập trong localStorage. Không tích hợp Firebase, Google Sheet, Inventory, backend/RBAC, OpsCore, Worker hoặc Production. Không nhập ảnh/chân dung hay thông tin vận hành thật khi xem tại public CDN.

## Giao diện
- Nhận diện: `CÔNG TY CỔ PHẦN THE SUPRA - DC HƯNG YÊN` tại tiêu đề trái; thông tin **Quản trị viên** duy nhất trong thanh trên; cạnh dưới sidebar chỉ có nút Đăng xuất.
- Cỡ chữ mặc định tăng **10 điểm phần trăm** so với v0.7: từ 100% thành 110%. Cài đặt 100–130% theo bước 5%; người có mức chữ cũ được nâng +10 điểm **một lần**.
- Giao diện sáng chọn **7 màu**: đỏ, cam, vàng, lục, lam, chàm, tím. Mặc định lam; lưu lựa chọn theo trình duyệt. Giao diện tối giữ màu riêng, không bị thay đổi bởi palette sáng.
- Giảm padding/margin ở đầu trang, menu, KPI, bảng, quét ca; vẫn tăng cỡ chữ và bảo đảm xem trên desktop/mobile.
- **Tổng quan** chỉ đọc, dữ liệu tính từ 6 phân hệ: 8 KPI nhân sự/ca/công nhật/biên bản/CCDC/PDA, trạng thái tất cả phân hệ, việc cần xử lý, biểu đồ quét theo giờ và lượt ca gần đây. **Không có tạo/sửa/xóa, tạo biên bản hay lối tắt điều hướng**.
- Có 7 phân hệ: Tổng quan, Nhân sự, Ra/vào ca, Công nhật, Biên bản, Công cụ dụng cụ, Mượn/trả PDA. Menu HTML anchor thật cho chuột phải mở tab mới.

## Nghiệp vụ demo
- Nhân sự: trường theo tiêu đề Google Sheet tham chiếu (mã NV, họ tên, điện thoại, vị trí, nhà cung cấp, bộ phận, site, kho, ngày bắt đầu, ghi chú, người/thời gian cập nhật), cùng hai trường **ca được phân/user làm việc** giả lập để thử liên kết quét. Có chỉnh sửa ảnh đại diện JPEG/PNG/WebP, được thu nhỏ JPEG 192×192 trong trình duyệt.
- Ra/vào ca: nhập/bắn mã, xem hồ sơ, chọn chế độ vào/ra và Enter để ghi nhận; chặn ca chưa phân, mã không tồn tại, quét vào trùng/ra thiếu lượt mở. Không sửa lịch sử quét thủ công.
- PDA: danh mục 3 seri giả lập và lịch sử mượn/trả; bảo vệ không mở hai lượt mượn trùng PDA.
- **Xuất Excel .xlsx thật** trên các phân hệ có bảng (từ bản ghi đã lọc), với tiêu đề có định dạng, cố định hàng tiêu đề và bộ lọc Excel. Tự tạo OOXML/ZIP tại trình duyệt, **không dùng CSV** hoặc tải thư viện bên ngoài; giữ mã nhân viên dạng chuỗi để không mất số 0 đầu.

## Kiểm chứng
```bash
cd prototype
npm run check
npm run build
python tests/browser_smoke.py
python tests/hosted_smoke.py
```
- GitHub Actions `.github/workflows/office-check.yml` chạy build, Chromium giao diện, HTTP-hosted Chromium (đăng nhập, multi-tab, đồng bộ, xuất XLSX) và dùng `openpyxl` để kiểm tra file xuất thật.
- `CODE_READY` và `CI_PASS` chỉ được công bố khi commit code và các bài kiểm thử thực sự PASS trên GitHub. PR vẫn chưa merge, không phát hành hoặc tạo tài nguyên provider.
- **Không kiểm thử:** máy quét vật lý, dữ liệu/ảnh thật, phân quyền server, dữ liệu ca có thẩm quyền, APK/Production/Field. Google Sheet tham chiếu chỉ đọc; chưa có mapping mã nhân viên ↔ lịch phân ca ↔ user dùng thật.
