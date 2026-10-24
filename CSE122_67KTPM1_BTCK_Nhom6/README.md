# ALQ ship – ParcelPulse (bản tách từ React sang HTML + Bootstrap 5 + JS thuần)

## Cách chạy
Mở thư mục bằng VS Code + Live Server (hoặc `python -m http.server`), rồi vào `index.html`.
Cần Internet để tải Bootstrap và Bootstrap Icons từ CDN.

## Đăng nhập demo
Email bất kỳ + mật khẩu `123456`, chọn vai trò. Đây chỉ là mô phỏng phía trình duyệt, KHÔNG phải bảo mật thật.

## Cấu trúc
- `css/style.css`: CSS gốc (index.css) giữ nguyên. Bootstrap nạp trước bằng CDN.
- `js/main.js`: menu theo vai trò, chặn truy cập sai vai trò, toast, đăng xuất.
- `js/pages/*.js`: JavaScript riêng cho từng trang.
- `pages/<vai-trò>/*.html`: mỗi giao diện một file.

## Cách thêm một trang mới
Sao chép `pages/recipient/track-parcel.html`, đổi nội dung trong `#page-content`,
rồi gọi `initShell({role, page, title, subtitle})` ở đầu file JS của trang.

## Trạng thái
Đã làm: toàn bộ 33 trang theo vai trò + 6 màn hình xác thực (đăng nhập, đăng ký, quên mật khẩu, OTP, đặt lại mật khẩu, khiếu nại). Hộp thoại dùng Bootstrap Modal.
Chưa chạy thử trên trình duyệt thật.
