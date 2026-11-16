# PickPack 1291 — Web Office v0.9.8

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

## Web Office v0.8.9 — Đồng hồ chỉ hiển thị giờ
- Bỏ hoàn toàn dòng thứ/ngày/tháng/năm và bộ định dạng ngày dư thừa khỏi topbar. Chỉ còn đồng hồ lật HH:mm:ss theo giờ Việt Nam.
- Tăng thẻ lên 28 × 44 px (desktop), thu nhỏ theo breakpoint để giữ nguyên vị trí tìm kiếm/thông báo và không tràn trên tablet/mobile; animation 3D không đổi.
- Kiểm thử Chromium nguồn và hosted: không còn phần tử ngày, thẻ lật được phóng lớn và nằm trọn trong khu vực đồng hồ ở màn hình desktop/tablet/mobile; không gọi API nghiệp vụ.

## Web Office v0.8.10 — đồng hồ đồng bộ giao diện
- Theo yêu cầu Owner: **loại bỏ hoàn toàn flip clock** (mặt số, CSS 3D và JavaScript animation). Thay bằng đồng hồ chữ `HH:mm:ss` không khung nền; giờ/phút nổi bật, giây nhỏ/màu phụ theo theme sáng/tối, vẫn dùng giờ Việt Nam và không hiển thị ngày.
- Cập nhật chỉ 2 phần DOM giờ/phút và giây mỗi giây, không dựng lại trang; thanh trên giữ đúng vị trí tìm kiếm/thông báo ở các mục. Giữ tương thích mobile và không gọi API nghiệp vụ.
- Kiểm thử nguồn, Chromium, hosted và CDN: xem checkpoint `PP-20261115-022` trong `docs/JOURNAL.md`. Web demo `admin/admin`, dữ liệu giả lập trong trình duyệt; không Production.

## Web Office v0.9.0 — nghiệm thu UI/UX 10 hạng mục (dữ liệu giả)
- Đồng hồ `hh:mm:ss AM/PM` theo giờ Việt Nam. Toast tồn tại tối đa 5 giây, hiển thị nhiều nhất 5 thông báo, mới thay cũ, không chắn thao tác.
- Modal xác nhận đồng nhất, đặt giữa màn hình; khi sửa/xóa bản ghi và danh mục phải nhập mật khẩu kiểm thử `admin`. Đây là **mô phỏng, không phải re-auth bảo mật**; Product thật cần xác thực và phân quyền phía server.
- Ảnh JPEG/PNG/WebP tối đa 5 MB: ảnh vuông 192px dùng làm avatar, blob nguyên bản lưu **IndexedDB của trình duyệt**, hiển thị lớn trong hồ sơ và phóng to. Không truyền ảnh lên GitHub/provider. Tuyệt đối chỉ dùng **ảnh giả lập**, không nhập ảnh chân dung/thông tin nhân sự thật trên rawcdn.githack.com (public/shared-origin). Dung lượng ảnh phụ thuộc quota trình duyệt, không đồng bộ giữa các máy.
- Công nhật: chọn Công việc công nhật (danh mục CRUD riêng), quét lần đầu tạo bản ghi bắt đầu, quét lần thứ hai cùng nhân viên/ngày kết thúc đúng bản ghi; hiển thị một dòng với giờ BĐ + KT, không hiển thị Giờ công/Trạng thái/User làm việc. Dữ liệu công nhật cũ không có mốc thời gian không được tự suy diễn.
- Ra/vào ca: Vào ca chọn Ca 1/Ca 2/Ca HC bên cạnh loại thao tác, không lấy ca mặc định từ hồ sơ; Ra ca ẩn lựa chọn.
- Thêm nhân sự / Quản lý danh mục, Tạo biên bản / Quản lý danh mục, Thêm CCDC / Quản lý danh mục chuyển cạnh Xuất Excel. Danh mục Loại biên bản và Loại CCDC dùng làm nguồn select, chống xóa giá trị đang được tham chiếu.
- Web tĩnh 100% dữ liệu giả lập trong localStorage/IndexedDB, không gọi Firebase/Cloudflare/OpsCore; URL CDN miễn phí phục vụ file tĩnh nhưng **không có SLA**. Mỗi thiết bị/trình duyệt giữ dữ liệu riêng. GitHub Actions standard public runner miễn phí, không phát sinh provider usage; không tự động thay thế Production.
- Test source commit `07220190e06049a7fe168e8d19308ea34395a240`, [Actions #43626063941](https://github.com/tamnv2/pickpack/actions/runs/43626063941), 7 tệp 213255 byte, Chromium + hosted browser + public CDN PASS.

## Web Office v0.9.1 — Ra/vào ca và tài nguyên
- **UI:** Hai nhãn `Loại thao tác` và `Ca làm việc` nằm cùng hàng ngang với nhóm button, ca chọn bằng `Ca 1 / Ca 2 / Ca HC` thay vì select. Trạng thái chế độ và ca giữ nguyên xuyên các lượt quét/đổi màn hình; luôn focus lại mã nhân viên sau khi ghi nhận. Khi chọn Ra ca, ẩn ca.
- **Cấp user khi vào ca:** Dựa trên trường Vị trí chính: Pick → chọn từ User Pick; Pack thường/Auto → chọn từ User Pack và tùy chọn Bàn Pack. User đang được sử dụng trong ca khác bị chặn cấp trùng; Bàn Pack trùng cũng bị chặn. User/ca chỉ lưu trên lịch sử ca, không đặt cố định trong nhân sự. PDA lấy user từ ca hoạt động.
- **Quản lý tài nguyên:** tab trái mới có 4 danh mục `Loại user`, `User Pick`, `User Pack`, `Bàn Pack`, mỗi loại cho phép thêm/sửa/xóa và chặn xóa tài nguyên đã có tham chiếu; tất cả dữ liệu giả lập tại localStorage, không phải tài khoản Firebase hay role backend.
- **Ảnh tại màn quét:** chân dung nằm trọn bên trái thông tin nhân sự, chiều cao giới hạn theo vùng preview, chiều rộng tự theo tỷ lệ ảnh gốc; nếu đã tải ảnh kiểm thử thì đọc blob nguyên bản từ IndexedDB, không kéo giãn/cắt ảnh. Khi không có ảnh, hiện placeholder; không suy đoán ảnh thật.
- **Giới hạn:** Đây vẫn là demo công khai, không nhập user credential hoặc ảnh/nhân sự thật. Không gọi Firebase/Cloudflare/OpsCore, không có đồng bộ đa thiết bị hoặc bảo mật server-side. Chỉ code và kiểm thử trong Draft PR #2, chưa Production.

## Web Office v0.9.2 — Kiểm tra trường dữ liệu nhân sự
- Khi **tạo** hồ sơ, `Ngày nhận việc` tự điền ngày hiện tại theo múi giờ Việt Nam `Asia/Ho_Chi_Minh` và vẫn sửa được; khi **sửa**, giữ ngày đã lưu.
- `Mã nhân viên` và `Số điện thoại` là chuỗi ký tự số 0–9 (giữ số 0 ở đầu); tự loại ký tự khác ngay khi nhập/dán. Mã nhân viên dài 2–30 ký tự; số điện thoại không bị ép về số nguyên, không tự thêm điều kiện độ dài mới.
- `Họ và tên` chỉ nhận chữ Unicode (bao gồm chữ Việt có dấu) và dấu cách giữa các từ; loại số/ký hiệu khi nhập/dán. Tạm giữ nguyên văn bản trong thời gian IME gõ tiếng Việt, lọc sau khi hoàn tất composition. Kiểm tra lại cả ba trường trước khi lưu, không chỉ dựa vào form HTML.
- Kiểm thử tự động Chromium và hosted HTTP: ngày mặc định VN qua mốc nửa đêm, chọn ngày khác, sao chép/dán ký tự không hợp lệ, tên Unicode, giữ số 0 đầu và chặn dữ liệu sai khi bypass thao tác nhập bình thường.
- **Chỉ demo offline:** kiểm tra phía client không thay thế validation/RBAC ở backend Production; không có phát hành hoặc provider usage mới.

## v0.9.3 — Sao lưu/khôi phục toàn bộ dữ liệu kiểm thử giữa các máy
- Vào **Quản trị viên → Cài đặt → Dữ liệu kiểm thử**: **Xuất dữ liệu** tải về một tệp `pickpack-1291-v0.9.3-YYYY-MM-DD.json`; **Nhập dữ liệu** để khôi phục trên máy/trình duyệt khác chạy **đúng Web v0.9.3**.
- File gồm **toàn bộ bản ghi** đang dùng (nhân sự, ra/vào ca, công nhật, biên bản, CCDC, PDA, danh sách thiết bị), **danh mục/tài nguyên**, ảnh đại diện trong hồ sơ, **ảnh chân dung nguyên gốc từ IndexedDB** và chế độ giao diện. Dữ liệu được lưu tại localStorage + IndexedDB của trình duyệt và tự lưu khi thao tác; không có DB/provider server hoặc đồng bộ thời gian thực.
- Nhập chỉ chấp nhận gói đúng `format`, `schema=1`, `webVersion=0.9.3` và kiểm tra các nhóm dữ liệu, danh mục, ảnh. Chỉ sau khi xác minh mới mở **modal xác nhận ghi đè toàn bộ** + mật khẩu demo admin. Nhập không hợp lệ hoặc bấm Hủy không thay đổi dữ liệu. Khi gặp lỗi lưu, Web cố gắng khôi phục dữ liệu và ảnh cũ, báo nếu khôi phục thất bại.
- **Quy trình:** Máy A → Xuất dữ liệu → chép file sang máy B → mở Web cùng phiên bản → Đăng nhập demo → Nhập dữ liệu → xác nhận. Sau đó máy B có thể tiếp tục thêm/sửa/xóa mà không cần tạo lại. Muốn chuyển các cập nhật mới nhất thì xuất lại ở máy đang sử dụng và nhập lại ở máy đích (bản nhập sẽ **thay thế** toàn bộ dữ liệu hiện tại; không merge).
- **Lưu ý:** JSON chưa mã hóa và có thể chứa ảnh/hồ sơ; chỉ lưu và chuyển file giả lập kiểm thử, **không dùng dữ liệu nhân sự thật** trên CDN công khai hoặc chia sẻ tệp ra ngoài. Không đưa file sao lưu vào GitHub. Lưu trữ là theo origin + hồ sơ trình duyệt (xóa dữ liệu site, chế độ ẩn danh và thay đổi thiết bị có thể mất dữ liệu); nên xuất backup thường xuyên.
- Bản kiểm thử chỉ dùng file tĩnh, không phát sinh Firebase/Cloudflare/OpsCore API. Không cài đặt provider, không merge/phát hành Production.

## Web v0.9.4 — Khởi tạo dữ liệu trống để người dùng tự nhập
- **APPROVED:** Mọi danh sách nghiệp vụ, PDA và các danh mục/tài nguyên khởi tạo **0 bản ghi**, không sinh dữ liệu giả tự động. Các dữ liệu mẫu cũ được chuyển thành tệp fixture **chỉ phục vụ CI** `prototype/tests/legacy_fixture.json` (không phân phối cùng Web).
- Dùng khóa localStorage + IndexedDB riêng cho v0.9.4, nên mở lần đầu bản mới trong trình duyệt đang dùng v0.9.3 cũng **không tự tái sử dụng dữ liệu cũ**. Chức năng **Quản trị viên → Cài đặt → Dữ liệu kiểm thử → Xóa dữ liệu** có cảnh báo + yêu cầu mật khẩu thử nghiệm, chủ động xóa dữ liệu/danh mục/ảnh của v0.9.4 và v0.9.3 **trong trình duyệt hiện tại**; không thể xóa thông tin trên thiết bị khác từ xa. Trước khi xóa, xuất backup nếu cần.
- Nhập danh mục **Vị trí chính, Nhà cung cấp, Bộ phận, Site, Kho** trước, sau đó tạo hồ sơ nhân sự thủ công. Các danh mục Công nhật, Biên bản, CCDC, Tài nguyên có thể thêm qua Quản lý danh mục / Quản lý tài nguyên. Danh sách PDA trống được bổ sung **Thêm PDA** (mã, seri, nguồn, ghi chú) và sửa/xóa có xác nhận, để có thiết bị thực hiện quét mượn/trả trên Web kiểm thử.
- Dữ liệu được tự lưu localStorage và ảnh chân dung riêng trong IndexedDB; **Xuất dữ liệu/ Nhập dữ liệu** `.json` đầy đủ như bản v0.9.3, nhưng chỉ chấp nhận **Web v0.9.4** vì có kiểm tra phiên bản chính xác. Xuất ở máy A, mở bản **cùng commit/phiên bản** ở máy B, nhập để ghi đè dữ liệu máy B.
- **Cảnh báo bảo mật:** Đây vẫn là giao diện chạy qua CDN công khai bên thứ ba, mật khẩu `admin` chỉ mô phỏng. Không nhập ảnh chân dung, tên/mã/số điện thoại nhân sự thật hoặc dữ liệu vận hành nhạy cảm vào bản Web CDN công khai. JSON sao lưu không mã hóa; không đưa lên GitHub, không chia sẻ cho bên không có thẩm quyền. Muốn dùng hồ sơ thật cần bản nội bộ hoặc backend riêng được phê duyệt.
- **Đảm bảo:** Không có API Firebase/Cloudflare/OpsCore; chưa merge/Production. Xóa dữ liệu ở một máy không tác động dữ liệu máy khác.

## Web v0.9.5 — Chân dung, biên bản ảnh và Excel nhân sự (môi trường kiểm thử cục bộ)
- **Icon:** sửa menu Quản lý tài nguyên hiển thị sai `undefined` vì `list` chưa có trong bản đồ SVG sidebar.
- **Nhân sự:** chọn ảnh hoặc dán **Ctrl + V** trực tiếp vào form Thêm/Sửa; chung giới hạn JPEG/PNG/WebP ≤5 MB, ảnh thu nhỏ dùng làm avatar, ảnh gốc lưu IndexedDB. Không dùng ảnh thật trên CDN công khai.
- **Excel nhân sự:** trong Quản lý nhân sự cạnh Xuất Excel thêm **Tải mẫu Excel** và **Nhập Excel**. File mẫu `.xlsx` có các cột Mã nhân viên, Họ và tên, Số điện thoại, Vị trí chính, Nhà cung cấp, Bộ phận, Site, Kho, Ngày nhận việc, Ghi chú; ID/điện thoại định dạng Text để giữ số 0 đầu. Nhập từ **sheet đầu tiên theo đúng cấu trúc mẫu** hỗ trợ XLSX ZIP stored/deflate, chuỗi sharedStrings, ngày dạng dd/mm/yyyy, yyyy-mm-dd hoặc số Excel. Kiểm tra tất cả hàng, mã trùng, chữ số/Unicode/ngày hợp lệ **trước khi ghi**. Chỉ thêm mới, không ghi đè hồ sơ hiện có; giá trị danh mục mới được thêm sau xác nhận mật khẩu demo. Excel không chứa ảnh; ảnh thêm thủ công, dữ liệu đầy đủ/ảnh xuất bằng backup JSON.
- **Biên bản ảnh:** Thêm/Sửa hỗ trợ upload nhiều JPEG/PNG/WebP hoặc dán Ctrl + V, tối đa 8 ảnh/biên bản và 5 MB/ảnh. Bản gốc lưu riêng ở IndexedDB; xem ảnh thu nhỏ ở form/chi tiết, nhấn để phóng to. Bỏ ảnh trong form không xóa cho tới khi ấn Lưu; Hủy không làm thay đổi ảnh đã lưu. Khi xóa biên bản, xóa ảnh liên kết.
- **Backup JSON:** định dạng `schema=2`, `webVersion=0.9.5` gồm các bản ghi, danh mục, chân dung và ảnh biên bản. Có kiểm tra tính toàn vẹn trước khi thay thế dữ liệu và rollback nếu lỗi ghi. **Cần đúng Web v0.9.5 cho cả hai máy**; file backup v0.9.4 không được chấp nhận tự động.
- **UI:** thêm khoảng đệm phía dưới form quản lý danh mục và thiết bị, bảo đảm nút Lưu/Hủy không chạm bo góc hộp.
- **Giới hạn an toàn:** GitHub repo và GitHack CDN đều public; chỉ dùng dữ liệu/ảnh giả lập hoặc ẩn danh. `admin/admin` không phải xác thực bảo mật, dữ liệu trong trình duyệt và file JSON không được bảo vệ như hệ thống nhân sự Production. Không có kết nối CSDL, Firebase/Cloudflare/OpsCore, chưa triển khai Production.

## Web v0.9.6 — Phân quyền giả lập và cải tiến nhập liệu (16/11/2026)
- **5 tài khoản kiểm thử mặc định:** `superadmin` (superadmin), `admin1`, `admin2` (admin), `dieuphoile`, `dieuphoichan` (mod). Mật khẩu của cả 5 là `1`, tên hiển thị trùng tên đăng nhập. Tài khoản `admin/admin` không còn đăng nhập được trên v0.9.6.
- **Quản lý quyền truy cập:** chỉ `superadmin` thao tác tài khoản và bảng checkbox Xem/Thêm/Sửa/Xóa từng phân hệ; menu này bị làm mờ/vô hiệu hóa với tài khoản khác. Admin mặc định có quyền nghiệp vụ (không quản lý tài khoản), mod chỉ có quyền xem và quét ca/PDA để thử, có thể chỉnh bằng checkbox. Superadmin có combobox **Hiển thị theo quyền** ở thanh trên để xem đúng giao diện/quyền của từng user.
- **Cài đặt cá nhân:** đổi họ tên, mật khẩu kiểm thử; cỡ chữ, màu chủ đạo và thao tác backup vẫn ở hộp cài đặt. Tùy chọn Tự động/Sáng/Tối chuyển ra thanh trên. Bảy mẫu màu sáng cùng một hàng.
- **Sửa nhập liệu:** bỏ bộ lọc gõ tức thời ở Họ và tên để không can thiệp bàn phím tiếng Việt/IME; vẫn kiểm tra ký tự Unicode khi lưu. Số/mã vẫn chỉ nhận chữ số.
- **Thêm danh mục hàng loạt:** dấu + thêm input, dấu – xóa input cuối (không dưới một), nhấn Lưu để ghi đồng thời toàn bộ tên hợp lệ; tên trùng hay sai thì không ghi dòng nào.
- **Bảo vệ dữ liệu kiểm thử:** tiếp tục dùng khóa lưu bản ghi/danh mục v0.9.4, không tự xóa nội dung đã tạo trên v0.9.5. Tài khoản và ma trận quyền nằm riêng trong `localStorage`, **không** xuất vào backup JSON vì còn mật khẩu mẫu. Backup nghiệp vụ/ảnh chỉ chấp nhận đúng Web v0.9.6; cần xuất từ v0.9.5 nếu muốn giữ dữ liệu tại phiên bản cũ hoặc chuyển máy trước khi đổi phiên bản.
- **Giới hạn:** toàn bộ quyền/đăng nhập là mô phỏng JavaScript tại trình duyệt, có thể bị vượt qua bằng DevTools. Mật khẩu mock lưu ở máy dạng đọc được. Chỉ dùng dữ liệu giả; **không dùng để bảo vệ hồ sơ nhân sự thật**. Server RBAC/Firebase/Auth, APK, realtime và Production vẫn chưa được triển khai.

## Web v0.9.7 — Ảnh đại diện có thể căn chỉnh
- Khi chọn/chụp hoặc dán Ctrl + V ảnh nhân sự, mở khung cắt với **kéo thả vị trí**, phóng to/thu nhỏ qua thanh trượt, nút +/− hoặc con lăn, Căn giữa, Áp dụng/Hủy. Vùng tròn hướng dẫn hiển thị avatar; hỗ trợ chuột, cảm ứng và phím mũi tên. Dữ liệu ảnh thu nhỏ 192×192 JPEG, ảnh gốc vẫn giữ riêng trong IndexedDB và bản sao lưu nghiệp vụ JSON.
- Khi sửa nhân sự đã có ảnh, nhấn **Căn chỉnh ảnh** để chỉnh lại từ ảnh gốc; khi ảnh gốc không tồn tại có thể dùng ảnh avatar đang lưu làm phương án dự phòng. Hủy khung cắt không đổi dữ liệu; chỉ lưu vào hồ sơ sau khi nhấn Lưu trong form nhân sự.
- File mẫu 100 người **giả lập** được tạo riêng trong hội thoại (không commit vào GitHub): mã 100–199, đúng 10 cột Excel nhập nhân sự, 1 Trưởng kho/1 Trưởng nhóm/2 Chuyên viên/2 Tổ trưởng/6 Kéo hàng/14 Pack/74 Pick; cố định Pick Pack/1291/HY1. Chỉ dùng để thử importer, không phải dữ liệu nhân sự thật.
- Backup JSON vẫn kiểm tra **đúng phiên bản**; Web v0.9.7 không tự động nhập JSON của v0.9.6. Dữ liệu trên cùng trình duyệt tiếp tục sử dụng các khóa bản ghi đang có. Không triển khai backend, không nhập dữ liệu nhân sự thật vào bản CDN công khai.

## Web v0.9.8 — Căn chỉnh avatar và hộp chi tiết giữa màn hình
- Hộp xem hồ sơ/tác nghiệp nay căn giữa, có cuộn, không còn drawer bên phải. Form thêm/sửa và xác nhận giữ modal giữa màn hình; portrait và vùng quét được căn giữa theo chiều dọc, giữ tỷ lệ.
- Trong hồ sơ hoặc kết quả quét có nút **Căn chỉnh ảnh** (chỉ người có quyền sửa nhân sự). Sau xác nhận mật khẩu mock, Web mở trực tiếp khung crop; zoom mặc định 125%, có thể thu về 100% vừa khung; kéo ảnh và nhấn Áp dụng rồi Lưu. Giữ ảnh gốc riêng, hủy không làm thay đổi dữ liệu.
- Bản v0.9.8 dùng lại hồ sơ/ảnh local trên cùng origin; JSON backup schema 2 từ v0.9.7 cũng được nhập vào v0.9.8; chuyển từ GitHack sang domain Cloudflare cần export/import do dữ liệu lưu theo origin.
- **Cloudflare:** 7 static assets có thể host theo Workers Static Assets, nhưng Web này CHƯA có server API, xác thực Firebase UID/role chung, RBAC, dữ liệu shared, realtime và lưu ảnh private. Không thể coi static preview là production-service tương thích 100%; các kiểm thử tích hợp cần hoàn tất trước khi phát hành. Chưa tạo tài nguyên hay deploy.
