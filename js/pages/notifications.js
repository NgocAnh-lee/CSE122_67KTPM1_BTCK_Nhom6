// Khởi tạo khung trang (sidebar, header...) do main.js cung cấp.
// subtitle để rỗng vì bên dưới render() sẽ tự cập nhật số thông báo chưa đọc.
initShell({
  role: "recipient",
  page: "recipient/notifications",
  title: "Trung tâm thông báo",
  subtitle: ""
});

// Dữ liệu thông báo (hiện đang gán cứng).
// Mỗi phần tử là mảng: [0] tiêu đề, [1] nội dung, [2] thời gian, [3] class icon Bootstrap
const ITEMS = [
  ["Đơn hàng đang trên đường giao", "Tài xế Nguyễn Văn Hùng dự kiến đến trong 35 phút.", "5 phút", "bi-truck"],
  ["Yêu cầu đổi lịch đã được chấp nhận", "Đơn PPVN-7153-9021 sẽ được giao lại từ 17:00-20:00.", "1 giờ", "bi-clock"],
  ["Đơn hàng đã được giao thành công", "Hãy kiểm tra kiện hàng và gửi đánh giá cho chúng tôi", "Hôm qua", "bi-check-lg"]
];

// Danh sách chỉ số (index) của các thông báo đã đọc, ví dụ [0, 2]
let read = [];

// Nạp trạng thái đã đọc từ localStorage để giữ lại khi tải lại trang.
// try/catch phòng trường hợp dữ liệu hỏng hoặc trình duyệt chặn localStorage.
try {
  read = JSON.parse(localStorage.getItem("pp-read")) || [];
} catch {}

// Vẽ lại toàn bộ danh sách thông báo ra màn hình
function render() {
  const list = document.getElementById("list");
  list.innerHTML = ""; // xóa danh sách cũ trước khi vẽ lại

  // Cập nhật dòng phụ đề ở header: số thông báo chưa đọc = tổng - đã đọc
  const sub = document.querySelector("header p");
  if (sub) sub.textContent = `${ITEMS.length - read.length} thông báo chưa đọc`;

  ITEMS.forEach((x, i) => {
    const isRead = read.includes(i);
    const b = document.createElement("button");
    b.className = isRead ? "read" : ""; // class "read" ăn với CSS nền trắng

    // Dựng khung HTML trước, chừa trống h3/p/span; nếu chưa đọc thì thêm chấm xanh <b>
    b.innerHTML = `
      <i class="bi ${x[3]}"></i>
      <div>
        <h3></h3>
        <p></p>
        <span></span>
      </div>
      ${isRead ? "" : "<b></b>"}`;

    // Gán chữ bằng textContent (không dùng innerHTML) để tránh lỗi chèn mã độc (XSS)
    b.querySelector("h3").textContent = x[0];
    b.querySelector("p").textContent = x[1];
    b.querySelector("span").textContent = x[2];

    // Bấm vào thông báo: đánh dấu đã đọc (nếu chưa) rồi hiện toast/thông báo nhỏ
    b.onclick = () => {
      if (!read.includes(i)) save([...read, i]);
      notify(x[0], x[1]); // notify() có sẵn từ main.js
    };
    list.appendChild(b);
  });
}

// Lưu trạng thái đã đọc vào biến + localStorage, rồi vẽ lại giao diện
function save(r) {
  read = r;
  try {
    localStorage.setItem("pp-read", JSON.stringify(r));
  } catch {}
  render();
}

// Nút "Đánh dấu tất cả đã đọc": đánh dấu mọi index từ 0 đến cuối danh sách
document.getElementById("read-all").onclick = () => {
  save(ITEMS.map((_, i) => i));
  notify("Đã đọc tất cả", "Mọi thông báo đã được đánh dấu.");
};

// Chạy lần đầu khi mở trang
render();