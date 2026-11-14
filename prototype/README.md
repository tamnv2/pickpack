# PickPack 1291 — Web Office v0.8.8

**Phạm vi:** Web prototype tĩnh, bản ghi hoàn toàn giả lập trong localStorage. Không tích hợp Firebase, Google Sheet, Inventory, backend/RBAC, OpsCore, Worker hoặc Production. Không nhập ảnh/chân dung hay thông tin vận hành thật khi xem tại public CDN.

## Bản Web kiểm thử công khai
- **Bản đã xác minh trước đó v0.8.1:** https://rawcdn.githack.com/tamnv2/pickpack/ddc12d9b66461f842f65c6f8ffa323f3d992a41d/prototype/index.html
- Đăng nhập kiểm thử `admin/admin`; **không phải xác thực thật**. Bản preview là tệp tĩnh từ commit riêng bất biến, công khai qua CDN bên thứ ba. CDN có thể hiển thị trang xác nhận trước khi mở HTML lần đầu. Không nhập dữ liệu nhân sự/ảnh thật.
- **v0.8.7:** liên kết xem thử bất biến lấy từ SHA của lần CI PASS mới nhất, ghi nhận tại `docs/JOURNAL.md` và `ops/state.json`. Không thêm Worker/Firebase/Netlify/GitHub Pages, không merge hay deploy Production.

## Giao diện
- Nhận diện: `CÔNG TY CỔ PHẦN THE SUPRA` và dòng tiếp theo `DC HƯNG YÊN` tại tiêu đề trái; thông tin **Quản trị viên** duy nhất trong thanh trên; dưới sidebar có phiên bản Web và dòng ghi công; Đăng xuất trong menu tài khoản.
- **Cài đặt chữ mặc định 100%**; kích thước thực là **110% so với font gốc** (nhân 1,1). Cho phép 90–120%, bước 5%; thiết lập cũ được chuyển về thang tỷ lệ mới để tránh phóng to hai lần.
- Giao diện sáng chọn **7 màu**: đỏ, cam, vàng, lục, lam, chàm, tím. Mặc định lam; lưu lựa chọn theo trình duyệt. Giao diện tối giữ màu riêng, không bị thay đổi bởi palette sáng.
- Đồng nhất mật độ hiển thị theo toàn bộ phân hệ: một tiêu đề/trang, bỏ breadcrumb và mô tả trùng lặp; giảm các khoảng trắng, bảng mặc định vĩnh viễn, không có chọn Thẻ/Bảng, bỏ các thẻ tổng hợp không cần thiết ở tab dữ liệu.
- Dòng ghi công **“Phát triển hệ thống - tamnv2 | Pick Pack 1291”** được đặt ngay dưới phiên bản Web ở đáy sidebar; nhãn **Web v0.8.7** hiển thị ở đáy sidebar và trên màn hình đăng nhập.
- **Tổng quan** chỉ đọc, dữ liệu tính từ 6 phân hệ: 8 KPI nhân sự/ca/công nhật/biên bản/CCDC/PDA, trạng thái tất cả phân hệ, việc cần xử lý, biểu đồ quét theo giờ và lượt ca gần đây. **Không có tạo/sửa/xóa, tạo biên bản hay lối tắt điều hướng**.
- Có 7 phân hệ: Tổng quan, Nhân sự, Ra/vào ca, Công nhật, Biên bản, Công cụ dụng cụ, Mượn/trả PDA. Menu HTML anchor thật cho chuột phải mở tab mới.

## Nghiệp vụ demo
- Nhân sự: trường theo tiêu đề Google Sheet tham chiếu (mã NV, họ tên, điện thoại, vị trí, nhà cung cấp, bộ phận, site, kho, ngày bắt đầu, ghi chú, người/thời gian cập nhật), cùng hai trường **ca được phân/user làm việc** giả lập để thử liên kết quét. Có chỉnh sửa ảnh đại diện JPEG/PNG/WebP, được thu nhỏ JPEG 192×192 trong trình duyệt.
- Ra/vào ca: nhập/bắn mã, xem hồ sơ, chọn chế độ vào/ra và Enter để ghi nhận; chặn ca chưa phân, mã không tồn tại, quét vào trùng/ra thiếu lượt mở. Không sửa lịch sử quét thủ công.
- Công nhật: quét mã/QR nhân viên, lấy tên/mã/ca/user; tạo một dòng tạm tính mỗi nhân viên/ngày, ghi giờ quét; **không tự suy giờ công hoặc công việc đã làm** khi thiếu bằng chứng, chặn bản ghi trùng.
- PDA: nhập/quét QR nhân viên, sau đó quét ID PDA, seri hoặc 5 số cuối seri; kiểm tra khớp duy nhất thiết bị, ghi mượn hoặc trả; ngăn mượn trùng hoặc trả khi chưa mượn. Người trả có thể khác người mượn; cả hai đều được ghi nhận để phục vụ kiểm tra. Dữ liệu chỉ là giả lập.
- **Xuất Excel .xlsx thật** trên các phân hệ có bảng (từ bản ghi đã lọc), với tiêu đề có định dạng, cố định hàng tiêu đề và bộ lọc Excel. Tự tạo OOXML/ZIP tại trình duyệt, **không dùng CSV** hoặc tải thư viện bên ngoài; giữ mã nhân viên dạng chuỗi để không mất số 0 đầu.

## Kiểm chứng
```bash
cd prototype
npm run check
npm run build
python tests/browser_smoke.py
python tests/hosted_smoke.py
```
- GitHub Actions `.github/workflows/office-check.yml` chạy build, Chromium giao diện, HTTP-hosted Chromium (đăng nhập, đa tab, quét Công nhật/PDA, xuất XLSX) và dùng `openpyxl` để kiểm tra file xuất thật. Đồng thời kiểm tra CDN công khai.
- `CODE_READY` và `CI_PASS` chỉ được công bố khi commit code và các bài kiểm thử thực sự PASS trên GitHub. PR vẫn chưa merge, không phát hành hoặc tạo tài nguyên provider.
- **Không kiểm thử:** máy quét vật lý, dữ liệu/ảnh thật, phân quyền server, dữ liệu ca có thẩm quyền, APK/Production/Field. Google Sheet tham chiếu chỉ đọc; chưa có mapping mã nhân viên ↔ lịch phân ca ↔ user dùng thật.

## Web Office v0.8.7 — điều chỉnh UI và kiểm thử
- Bản Web tĩnh này không gọi API Firebase/Cloudflare/OpsCore. Toàn bộ thao tác trên dữ liệu giả lập bằng localStorage của trình duyệt; việc tải file tĩnh CDN vẫn sử dụng lưu lượng mạng và không đồng bộ giữa máy khác nhau.
- Sidebar không còn ô Kho 1291, nhãn nhóm hay tiêu đề trang trùng lặp. Bảy tên menu đều dài 5–6 từ: Tổng quan hoạt động vận hành; Quản lý hồ sơ nhân sự; Ghi nhận ra vào ca; Quản lý công nhật nhân sự; Quản lý biên bản sự việc; Quản lý công cụ dụng cụ; Ghi nhận mượn trả PDA. Menu tự xuống dòng để không cắt chữ. Bỏ nút ba gạch trên desktop; trên mobile có nút Mục để truy cập sidebar.
- Nhấp tài khoản Admin tại góc trên trái để mở Tùy chọn hiển thị và Đăng xuất. Nút thông báo ở bên phải.
- Nhân sự > Quản lý danh mục: CRUD năm danh mục Vị trí chính, Nhà cung cấp, Bộ phận, Site, Kho; dữ liệu làm nguồn select trên biểu mẫu nhân sự, chặn tên trùng và xóa giá trị đang dùng; đổi tên cập nhật hồ sơ demo tham chiếu.
- UI có hiệu ứng phản hồi nhập đúng/sai, thao tác, quét mã, menu, thông báo, đăng nhập/đăng xuất, và tôn trọng chế độ giảm chuyển động của thiết bị.
- Chỉ được nhập dữ liệu giả lập. Login admin/admin chỉ là mock, KHÔNG PHẢI xác thực/ủy quyền thật; không Production.

## Web Office v0.8.7 — bổ sung theo Owner
- **Bảng nhân sự:** hiển thị thêm `Ngày nhận việc` (trường dữ liệu `startDate` đã tồn tại) và `Cập nhật bởi` (`updatedBy` đã tồn tại); thứ tự: Họ tên, Mã, SĐT, Vị trí, Nhà cung cấp, Bộ phận, Site, Kho, Ngày nhận việc, Cập nhật bởi, Thao tác. Cột bảng dùng intrinsic auto-width và cuộn ngang khi màn hình không đủ, không ép co/cắt nội dung. Ngày nhận việc trong form dùng input date rồi lưu dạng dd/mm/yyyy; Người cập nhật sinh tự động bằng danh tính Admin giả lập.
- **Menu đúng thứ tự:** Tổng quan vận hành → Quản lý nhân sự → Quét vào/ra ca → Mượn / trả PDA → Quản lý công nhật → Quản lý biên bản → Quản lý CCDC.
- **Chế độ hiển thị:** Tự động (mặc định ở trình duyệt mới), Sáng, Tối. Tự động dựa trên giờ `Asia/Ho_Chi_Minh`: sáng 06:00–17:59, tối 18:00–05:59; thay đổi tại ranh giới giờ, giữ override thủ công xuyên tab/phiên; không gọi API thời gian hoặc provider.
- **Thanh trên:** sticky khi cuộn; đồng hồ hh:mm:ss và ngày/ thứ theo giờ Việt Nam, cập nhật DOM mỗi giây mà không render lại toàn trang, chuyển động đèn nhẹ, responsive và reduced-motion.
- Tham khảo IBM/SAP (trạng thái/phân cấp enterprise), Airtable (biểu mẫu/dữ liệu), Linear (focus/microinteractions) theo `VoltAgent/awesome-design-md`; không chép giao diện, mã hoặc font thương mại.
- Chỉ Web kiểm thử giả lập và localStorage; không phát hành Production hay sửa nguồn Inventory.

## v0.8.7 — Đồng hồ lật + tìm kiếm Tổng quan
- Đồng hồ ở thanh ghim là **split-flap**: 6 chữ số trong các ô riêng, 2 dấu `:`; mỗi giây chỉ các chữ số thay đổi mới chạy hiệu ứng lật 3D nhẹ. Chữ số cập nhật theo giờ `Asia/Ho_Chi_Minh`; phần ngày vẫn hiển thị, không render lại trang; tôn trọng cài đặt hệ điều hành `prefers-reduced-motion`.
- Ô tìm kiếm hiển thị tại **Tổng quan vận hành** như các phân hệ còn lại. Tìm theo tất cả trường bản ghi tổng hợp từ 6 phân hệ demo (nhân sự, ca, PDA, công nhật, biên bản, CCDC); kết quả tối đa 12 mục cùng số khớp và liên kết mở chi tiết qua tab mới/chuột phải. Không thay đổi KPI trên Tổng quan hoặc gọi API.
- Kết quả cập nhật ngay khi nhập mà không re-render đồng hồ hay thẻ thống kê. Xóa nội dung tìm kiếm sẽ ẩn bảng kết quả; không có kết quả hiển thị thông điệp ngắn.
- Đây vẫn là Web tĩnh, dữ liệu giả lập lưu localStorage theo trình duyệt và tài khoản `admin/admin` chỉ phục vụ thử nghiệm; không phải Production.

## Web Office v0.8.7 — đồng hồ lật 3D và thanh trên đồng nhất
- Vùng tìm kiếm, thông báo, giờ/ngày đặt trong ba cột cố định của topbar ở tất cả các trang, bao gồm Tổng quan và Quản lý danh mục; chống dịch chuyển theo nội dung và có layout responsive. Danh mục hỗ trợ lọc tên, giữ đúng chỉ số gốc để sửa/xóa.
- Đồng hồ sử dụng 4 lớp trên mỗi chữ số: mặt tĩnh trên/dưới và hai nửa thẻ động; số cũ gập xuống theo X, số mới mở ra theo X. Chỉ animate chữ số đổi, cập nhật mặt dưới khi animation kết thúc, cập nhật thời gian qua DOM không dựng lại trang; reduced-motion bỏ animation. Giờ Việt Nam.
- Bản kiểm thử giả lập, không gọi API nghiệp vụ và không phát hành Production.

## Web Office v0.8.8 — Visual Timer-inspired mechanical flip
- Owner approved using https://visualtimer.com/timers/flip-clock/ as **visual/motion reference**. Original PickPack HTML/CSS/JS; no copied provider assets, libraries, requests, sound or countdown/stopwatch additions.
- Dark charcoal split-flap cards with larger white numerals, center hinge/end pins, contrast/shadows and top-out (270 ms) then bottom-in (320 ms) 3D easing. Only changed digits animate; HH:mm:ss and Vietnamese calendar date remain.
- Active flaps settle safely when hidden or reduced-motion is enabled; static face updates without page rerender or business API usage. Search/notification/clock toolbar slots stay unchanged.
- Chromium/HTTP-hosted E2E verifies mid-rotation transforms, reduced-motion settling, mobile and actual public CDN preview: GitHub Actions #43614819960 (tested source e5de98df9d5c3db9122641d75df2d3c59144686e). UI visual similarity still requires Owner review.
