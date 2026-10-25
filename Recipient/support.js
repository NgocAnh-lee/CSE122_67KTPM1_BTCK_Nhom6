//Gọi hàm để thiết lập giao diện chung
initShell({ 
  role: "recipient", 
  page: "recipient/support",//Xác định trang đang mở 
  title: "Phản hồi sự cố", 
  subtitle: "Gửi yêu cầu hỗ trợ đến trung tâm điều phối" 
});
const $ = (id) => document.getElementById(id);
//Tạo mảng rỗng để lưu dsach yêu cầu hỗ trợ, lấy dữ liệu từ localStorage
let tickets = [];
//getItem để lấy dữu liệu đã lưu
//localStorage tìm dữ liệu trong trình duyệt với tên pp-tickets, dữ liệu có thể lấy lại khi mở hoặc tải lại trang
//json.parse: chuyển chuỗi json thành dữ liệu java
//nếu try lỗi sẽ chuyển sang catch
try { tickets = JSON.parse(localStorage.getItem("pp-tickets")) || []; } catch {}
//Tạo sữ liệu mẫu nếu dsach đang rỗng
//!tickets.length: mảng đang không có phần tử
//open:false yêu cầu không ở trạng thái đang mở
if (!tickets.length) tickets = [{ id: "SP-0941", title: "Sai địa chỉ", status: "Đã giải quyết · 12/05/2025", open: false }];

//Thêm các đơn hàng đã chọn vào dsach
//forEach(): duyệt qua từng đơn hàng, o:đại diện cho 1 đơn hàng
ORDERS.forEach((o) => $("order").add(new Option(`${o.code} · ${o.status}`)));

//Tạo hàm hiển thị lịch sử yêu cầu
function renderHistory() {
  // Xóa nội dung lịch sử đang hiển thị để cập nhật lại, innerHTML để  làm rỗng nội dung
  $("history").innerHTML = "";
  // Nếu có yêu cầu (length >0 thì  hidden = true) thì ẩn thông báo danh sách trống, nếu không có yêu cầu (length=0) thì hiện thông báo 
  $("empty").hidden = tickets.length > 0;
  tickets.forEach((t) => {
    //Tạo 1 thẻ div tên biến là d chứa thông tin yêu cầu hỗ trợ 
    const d = document.createElement("div");
    //yêu cầu đang mở (đang được xử lý/ chờ giải quyết) thì gán lớp active để làm nổi bật yeu cầu
    if (t.open) d.className = "active";
    // i chứa biểu tượng 
    // //spN hiển thị đồng hồ hoặc dấu tích
    //strong chứa mã và tiêu đề yêu cầu
    d.innerHTML = `<i><span class="bi ${t.open ? "bi-clock" : "bi-check-lg"}"></span></i><div><strong></strong><p></p></div>`;
    //tìm thẻ strong trong d, .textContent để đọc hoặc thay đổi nội dung văn bản
    //t.id là mã yêu cầu
    d.querySelector("strong").textContent = `${t.id} · ${t.title}`;
    //t.status: lấy trạng thái của yêu cầu hiện tại
    d.querySelector("p").textContent = t.status;
    //đưa thẻ d đã có đủ nội dung lên lịch sử
    $("history").appendChild(d);
  });
}
//khi người dùng bấm gửi, code chạy, e: bắt đầu phần code thực hiện
$("form").addEventListener("submit", (e) => {
  e.preventDefault();
  //Lấy nội dung trong ô detail, cắt bỏ khoảng trắng thừa ở hai đầu rồi lưu vào biến detail
  const detail = $("detail").value.trim();
  //detail.length: đếm số ký tự <10 => báo lỗi, hidden = false để hiện thông báo => dừng
  if (detail.length < 10) { $("err").textContent = "Vui lòng mô tả ít nhất 10 ký tự."; $("err").hidden = false; return; }
  //nội dung đủ 10 ký tự => ẩn thông báo lỗi
  $("err").hidden = true;
  //1085: mã yêu cầu ban đầu, các mã sau cộng với số lượng yêu cầu đang có vd: lần 1 gửi mã sẽ là 1085 lần 2 gửi mã sẽ là 1085+1=1086
  const id = "SP-" + (1085 + tickets.length);
  //để thêm yêu cầu mới vào đầu danh sách với id là mã yêu cầu vừa tạo, title là loại sự cố người dùng chọn ở ô issue, open:true đánh dấu yêu cầu này đang được mở
  tickets.unshift({ id, title: $("issue").value, status: "Đang chờ điều phối viên · vừa xong", open: true });
  //JSON.stringify() chuyển danh sách thành dạng chuỗi văn bản để có thể lưu vào localStorage, pp-tickets để  lưu và tìm dữ liệu
  localStorage.setItem("pp-tickets", JSON.stringify(tickets));
  //Gửi yêu cầu thành công
  $("code").textContent = `Mã yêu cầu ${id}. Điều phối viên sẽ tiếp nhận và phản hồi qua ứng dụng.`;
  //=true :đặt thành ẩn, sau khi gửi thành công biểu mẫu sẽ ẩn đi
  //.hidden=false: phần tử done sẽ hiện trên giao diện
  $("form").hidden = true; $("done").hidden = false; renderHistory();
});
$("again").onclick = () => { $("form").reset(); $("form").hidden = false; $("done").hidden = true; };
renderHistory();
