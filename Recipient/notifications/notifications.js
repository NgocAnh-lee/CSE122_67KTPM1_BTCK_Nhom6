/* notifications.js - danh sách thông báo, đánh dấu đã đọc (lưu LocalStorage). */
//Tạo giao diện chung
initShell({ 
  role: "recipient",  
  page: "recipient/notifications", 
  title: "Trung tâm thông báo", 
  subtitle: "" 
});
//ITEMS chứa dsach các thông báo
//bi-check-lg: icon dấu tích
const ITEMS = [
  ["Đơn hàng đang trên đường giao", "Tài xế Nguyễn Văn Hùng dự kiến đến trong 35 phút.", "5 phút", "bi-truck"],
  ["Yêu cầu đổi lịch đã được chấp nhận", "Đơn PPVN-7153-9021 sẽ được giao lại từ 17:00–20:00.", "1 giờ", "bi-clock"],
  ["Đơn hàng đã được giao thành công", "Hãy kiểm tra kiện hàng và gửi đánh giá cho chúng tôi.", "Hôm qua", "bi-check-lg"],
];
//Mảng lưu các thông báo đã đọc
let read = [];
 // getItem() trả về dữ liệu dưới dạng chuỗi hoặc null nếu chưa có.
  // JSON.parse() chuyển chuỗi JSON thành dữ liệu JavaScript.
  // Nếu kết quả không có giá trị phù hợp, sử dụng mảng rỗng [].
try { read = JSON.parse(localStorage.getItem("pp-read")) || []; } catch {}

// Hàm render() dùng để hiển thị danh sách thông báo lên trang.
function render() {
  //Tìm phần tử có id list sau đó xóa nội dung cũ trước khi hiển thị lại dsach
  const list = document.getElementById("list"); list.innerHTML = "";
  //header hiển thị thông báo chưa đọc
  //ITEMS.length hiển thị toàn bộ thông báo
  //read.length: số vị trí đã đọc nếu không có vị trí trùng nhau
  document.querySelector("header p").textContent = `${ITEMS.length - read.length} thông báo chưa đọc`;

   // Duyệt qua từng thông báo trong mảng ITEMS.
  // x là nội dung của thông báo hiện tại.
  // i là vị trí của thông báo trong mảng, bắt đầu từ 0.
  ITEMS.forEach((x, i) => {
    const b = document.createElement("button");
    // Nếu thông báo đã đọc thì thêm class "read".
    // Nếu chưa đọc thì className là chuỗi rỗng.
    b.className = read.includes(i) ? "read" : "";
    // Tạo HTML cho thông báo: icon, tiêu đề, nội dung, thời gian và dấu chấm chưa đọc.
    // Nếu đã đọc thì không hiển thị dấu chấm báo chưa đọc.
    // Nếu chưa đọc thì thêm thẻ <b> để hiển thị dấu chấm.
    b.innerHTML = `<i><span class="bi ${x[3]}"></span></i><div><h3></h3><p></p><span></span></div>${read.includes(i) ? "" : "<b></b>"}`;
    // Điền tiêu đề (x[0]) vào thẻ h3.
    // Điền nội dung chi tiết (x[1]) vào thẻ p.
    // Điền thời gian (x[2]) vào thẻ span (loại trừ thẻ icon).
    b.querySelector("h3").textContent = x[0]; b.querySelector("p").textContent = x[1]; b.querySelector("span:not(.bi)").textContent = x[2];
    // Khi người dùng bấm vào thông báo: nếu chưa đọc thì lưu trạng thái đã đọc, sau đó hiển thị nội dung.
    b.onclick = () => { if (!read.includes(i)) save([...read, i]); notify(x[0], x[1]); };
    // Gắn nút thông báo này vào danh sách hiển thị trên trang.
    list.appendChild(b);
  });
}
// Hàm save(): cập nhật mảng read, lưu vào bộ nhớ LocalStorage và tải lại giao diện.
function save(r) { read = r; localStorage.setItem("pp-read", JSON.stringify(r)); render(); }
// Khi nhấn nút "Đánh dấu tất cả đã đọc": lưu vị trí của tất cả thông báo và hiện thông báo xác nhận.
document.getElementById("read-all").onclick = () => { save(ITEMS.map((_, i) => i)); notify("Đã đọc tất cả", "Mọi thông báo đã được đánh dấu."); };
// Gọi hàm render() ngay khi mở trang để hiển thị toàn bộ danh sách lên màn hình.
render();
