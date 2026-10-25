ALQ ship
Website mô phỏng nền tảng logistics thông minh, hỗ trợ theo dõi giao nhận và xử lý các nghiệp vụ vận chuyển. Dự án được tách từ React sang HTML, CSS, Bootstrap 5 và JavaScript thuần.
Liên kết dự án
Repository: CSE122_67KTPM1_BTCK_Nhom6
Website demo: ALQ ship Demo
Phạm vi
ALQ ship cung cấp giao diện mô phỏng cho nhiều vai trò trong quy trình logistics, bao gồm quản lý, điều phối, tài xế, người gửi và người nhận.
Các trang được xây dựng bằng HTML, CSS, Bootstrap 5 và JavaScript thuần. Giao diện hỗ trợ điều hướng giữa các trang và mô phỏng một số chức năng phục vụ việc trình diễn sản phẩm.
Lưu ý: Đây là bản prototype phục vụ học tập và trình diễn. Các chức năng xác thực hoặc dữ liệu phía trình duyệt không được xem là hệ thống bảo mật thực tế.
Bắt đầu
1. Yêu cầu hệ thống
Visual Studio Code.
Trình duyệt web hiện đại: Chrome.
Kết nối Internet để tải Bootstrap và Bootstrap Icons từ CDN.
2. Chạy dự án trên máy tính
Tải hoặc clone repository về máy tính:
git clone https://github.com/NgocAnh-lee/CSE122_67KTPM1_BTCK_Nhom6.git
Mở thư mục dự án bên trong CSE122_67KTPM1_BTCK_Nhom6 bằng Visual Studio Code.
Mở file index.html.
Chạy bằng tiện ích Live Server.
Đăng nhập demo
Email: Nhập email bất kỳ theo định dạng mong muốn trên giao diện demo.
Mật khẩu: 123456
Vai trò: Chọn vai trò phù hợp trước khi nhấn đăng nhập.
Tài khoản demo chỉ phục vụ kiểm thử giao diện. Không sử dụng mật khẩu cá nhân hoặc dữ liệu nhạy cảm.
Cấu trúc dự án
CSE122_67KTPM1_BTCK_Nhom6/
├── index.html
├── README.md
├── css/
│   └── style.css
├── js/
│   ├── main.js
│   └── pages/
└── pages/
    ├── admin/
    ├── dispatcher/
    ├── driver/
    ├── recipient/
    ├── sender/
    ├── login.html
    ├── register.html
    ├── forgot-password.html
    ├── reset-password.html
    ├── otp.html
    └── appeal.html

Công nghệ sử dụng
HTML5: Xây dựng cấu trúc trang web.
CSS3: Thiết kế giao diện và bố cục.
Bootstrap 5: Hỗ trợ giao diện responsive và các thành phần giao diện có sẵn.
JavaScript: Xử lý tương tác, logic trang và điều hướng trên giao diện.
GitHub Pages: Triển khai website công khai.
Triển khai
Website được triển khai tự động bằng GitHub Pages thông qua đường dẫn demo ở phần đầu README.
Khi cập nhật mã nguồn trên nhánh được cấu hình xuất bản, GitHub Pages sẽ tiến hành triển khai lại website sau khi quá trình build hoàn tất.
Mục đích
Dự án được thực hiện trong khuôn khổ bài tập nhóm môn CSE122, nhằm mục đích thực hành xây dựng giao diện web, tổ chức mã nguồn dự án thực tế và triển khai sản phẩm lên môi trường công khai.

