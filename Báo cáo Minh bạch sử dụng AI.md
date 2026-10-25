**BÁO CÁO KHAI BÁO MINH BẠCH SỬ DỤNG AI**

**Học phần:** CSE122 – Phát triển ứng dụng Web cơ bản  
**Nhóm 6 – 67KTPM1:** Lê Đào Ngọc Ánh \- Nguyễn Thị Thùy Linh \- Nguyễn Thị Như Quỳnh  
**Đề tài**: BTL-12: ParcelPulse – Theo dõi giao hàng và xử lý ngoại lệ (ALQ ship)  
**Repository:** https\://github.com/NgocAnh-lee/CSE122\_67KTPM1\_BTCK\_Nhom6

Nhóm thực hiện khai báo trung thực việc sử dụng công cụ AI trong quá trình nghiên cứu, thiết kế và phát triển website ALQ ship theo đúng yêu cầu của học phần.

**Khai Báo 1: Thiết Kế Kiến Trúc Dữ Liệu & Bản Kiểm Kê Màn Hình Theo Phân Quyền Vai Trò**

* **Công cụ:** Gemini & ChatGPT.  
    
* **Câu lệnh chính (Prompt):**  
    
  "Dựa vào yêu cầu đề tài BTL-12 ParcelPulse (Hệ thống theo dõi giao hàng và xử lý ngoại lệ), hãy phân tích luồng người dùng cho 5 vai trò chính (Admin, Dispatcher \- Điều phối, Driver \- Tài xế/Shipper, Recipient \- Người nhận, Sender \- Người gửi) và lập bảng kiểm kê màn hình tương ứng với các tệp HTML thực tế (login, admin/, dispatcher/, driver/, recipient/, sender/) đáp ứng tiêu chuẩn bao phủ trạng thái và lát cắt dọc."\*  
    
* **Phần AI sinh ra:** Gợi ý khung bảng cấu trúc danh sách các màn hình phân theo từng thư mục vai trò (như admin: overview, audit, settings; dispatcher: dashboard, orders, route-stops; driver: shipments, proof, stop-detail; recipient: track-parcel, delivery-feedback; sender: orders, support...) cùng các trường dữ liệu cho thực thể vận đơn (shipments), lịch sử hành trình (trackingLogs) và ngoại lệ (exceptions).  
    
* **Phần sinh viên chỉnh sửa:** Tự tay tổ chức thư mục và tinh chỉnh tên tệp theo chuẩn kebab-case cho từng vai trò (admin, dispatcher, driver, recipient, sender), bổ sung cấu trúc lưu trữ mã lỗi ngoại lệ thực tế và các trường dữ liệu phục vụ riêng cho nghiệp vụ bưu chính.  
    
* **Cách sinh viên kiểm chứng**: Tự rà soát lại hệ thống tệp tin HTML của các vai trò, đối chiếu với sơ đồ luồng nghiệp vụ để đảm bảo mỗi trang đều phục vụ đúng chức năng phân quyền và bao phủ trọn vẹn vòng đời của một đơn hàng.  
    
* **Điều sinh viên học được:** Hiểu rõ cách phân chia cấu trúc mã nguồn theo mô hình phân quyền (Role-based Structure) và áp dụng phương pháp phân tích lát cắt dọc (Vertical Slice) trong phát triển ứng dụng Web.

**Khai Báo 2: Thiết Kế Giao Diện Màn Hình & Dựng Mô Phỏng Tương Tác Trên Figma**

* **Công cụ:** Figma

* **Cách sử dụng:** Nhóm hỏi AI về cách bố trí layout cho 5 vai trò người dùng (admin, dispatcher, driver, recipient, sender), nhận gợi ý thiết kế khung màn hình, sau đó tự tay vẽ các bản thiết kế và nối prototype trên Figma.  
    
* **Câu lệnh chính (Prompt):**  
    
  "Cách tổ chức Bố cục (Layout), Bảng màu (Color Palette) và Sơ đồ luồng chuyển màn hình trên Figma cho ứng dụng theo dõi giao hàng ParcelPulse có 5 vai trò (Admin, Dispatcher, Driver, Recipient, Sender), đảm bảo hiển thị tối ưu trên cả giao diện Máy tính (cho Admin/Dispatcher) và Điện thoại (cho Driver/Recipient/Sender)?"  
    
* **Phần AI hỗ trợ:** Gợi ý danh sách kích thước khung màn hình chuẩn (Desktop 1440px, Mobile 390px), quy tắc phối màu nhận diện trạng thái vận đơn (xanh lá cho 'Thành công', đỏ/cam cho 'Ngoại lệ/Sự cố') và tư duy thiết kế luồng người dùng (User Flow).  
    
* **Phần sinh viên chỉnh sửa:** Tự tay vẽ toàn bộ hệ thống màn hình cho các góc nhìn vai trò trên Figma; dựng sẵn các thành phần giao diện (Component, Cards, Tables); tự nối luồng tương tác Prototype từ bước đăng nhập (login), tra cứu (track-parcel), điều phối tuyến đường (route-stops) đến màn hình xác nhận giao hàng bằng hình ảnh (proof).  
    
* **Cách sinh viên kiểm chứng:** Tự bật chế độ Present (Trình chiếu demo) trên Figma để thao tác bấm thử các nút, kiểm tra xem các liên kết chuyển trang giữa các giao diện vai trò có hoạt động trôi chảy và đúng logic nghiệp vụ hay không.  
    
* **Điều sinh viên học được:** Nắm vững tư duy thiết kế hệ thống màn hình đa vai trò, cách xây dựng Prototype tương tác thực tế và nguyên tắc bố trí giao diện người dùng hợp lý trước khi tiến hành viết code.

**Khai Báo 3: Xây Dựng Logic Xử Lý Bằng JavaScript Thuần Cho Các Trang Chức Năng**

* **Công cụ:** ChatGPT & Claude AI

* **Cách sử dụng:** Nhóm hỏi AI cách viết các đoạn mã JavaScript để xử lý logic điều hướng đăng nhập và thao tác nghiệp vụ cho từng vai trò (admin, dispatcher, driver, recipient, sender), sau đó thành viên tự đọc hiểu, tối ưu mã và tích hợp vào các trang HTML tương ứng.  
    
    
    
    
    
* **Câu lệnh chính (Prompt):**  
  "Viết các hàm JavaScript thuần xử lý logic phân quyền người dùng tại trang login.html; hàm lọc danh sách đơn hàng cho dispatcher/orders; chức năng cập nhật trạng thái đơn và tải ảnh bằng chứng giao hàng ở driver/proof; chức năng tra cứu vận đơn ở recipient/track-parcel và lưu trữ dữ liệu tập trung bằng LocalStorage."  
    
* **Phần AI hỗ trợ**: Gợi ý cấu trúc các hàm xử lý sự kiện DOM, thuật toán lọc/tìm kiếm danh sách đơn hàng, cách xử lý lưu trữ đối tượng JSON phức tạp vào localStorage, và xử lý các kịch bản bắt lỗi bằng try/catch.  
    
* **Phần sinh viên chỉnh sửa:** Đọc hiểu mã do AI sinh ra kết hợp với tra cứu, bổ sung ghi chú tiếng Việt, tinh chỉnh lại các selector tương ứng với từng thư mục vai trò, quyết định quy tắc kiểm tra dữ liệu đầu vào và viết hàm giả lập chuyển đổi linh hoạt giữa các tài khoản người dùng.  
    
* **Cách sinh viên kiểm chứng:** Thao tác trực tiếp trên trình duyệt từ trang login.html, thử đăng nhập từng vai trò để kiểm tra tính đúng đắn của giao diện, thử nghiệm các kịch bản nhập dữ liệu sai/thiếu, mở Console kiểm tra lỗi và F5 làm mới trang để xác minh dữ liệu còn lưu trong LocalStorage.  
    
* **Điều sinh viên học được:** Thành thạo kỹ năng thao tác DOM, xử lý sự kiện, tổ chức lưu trữ dữ liệu bằng LocalStorage và kỹ năng quản lý mã nguồn JavaScript theo từng nhóm chức năng vai trò.


  
**Khai Báo 4: Tối Ưu Hóa Giao Diện Responsive & Hoàn Thiện Sản Phẩm Triển Khai**

* **Công cụ:** Claude AI & ChatGPT.

* **Cách sử dụng:** Nhóm nhờ AI hướng dẫn kỹ thuật tối ưu giao diện linh hoạt cho màn hình di động và quy trình đóng gói đưa sản phẩm lên môi trường công khai, từ đó các thành viên tự chỉnh sửa CSS và cấu hình triển khai dự án.  
    
* **Câu lệnh chính (Prompt):**  
  "Cách tối ưu responsive cho các bảng dữ liệu nhiều cột và danh sách thẻ làm việc trên giao diện di động cho driver và recipient bằng CSS Media Queries/Bootstrap, kèm các bước triển khai toàn bộ cấu trúc thư mục dự án ParcelPulse lên GitHub và cấu trúc file README.md chuẩn."  
    
* **Phần AI hỗ trợ:** Gợi ý các lớp CSS responsive giúp tự động cuộn bảng hoặc chuyển đổi sang định dạng Card khi ở màn hình nhỏ, các bước push mã nguồn chứa các thư mục con lên Git và khung cấu trúc bài báo cáo README.  
  Phần sinh viên chỉnh sửa: Tự chỉnh sửa lại file CSS dùng chung để thống nhất màu sắc, phông chữ và khoảng cách đệm trên điện thoại; tự thực hiện các lệnh Git để đẩy toàn bộ thư mục bài tập lên GitHub và tự biên soạn file README.md mô tả chi tiết cách truy cập từng vai trò.  
    
* **Cách sinh viên kiểm chứng:** Sử dụng Chrome DevTools Device Mode kiểm tra độ tương thích trên các thiết bị mobile/tablet/desktop; truy cập liên kết GitHub Pages công khai để thao tác thử nghiệm toàn bộ ứng dụng trực tuyến và chạy thử kịch bản nghiệm thu theo hướng dẫn trong README.  
    
* **Điều sinh viên học được:** Nắm vững tư duy thiết kế giao diện thích ứng (Responsive Design), quy trình quản lý dự án web đa thư mục với Git/GitHub và cách trình bày tài liệu hoàn thiện sản phẩm chuyên nghiệp.

