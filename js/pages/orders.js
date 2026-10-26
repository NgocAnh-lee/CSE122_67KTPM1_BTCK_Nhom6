// ===== 1. KHỞI TẠO TRANG =====
// Đọc các thuộc tính data-* trên thẻ <body> (vd: data-role="admin" data-mode="billing")
const D = document.body.dataset;

// Dựng khung chung của trang (menu, tiêu đề, phụ đề) theo vai trò và trang hiện tại
initShell({ role: D.role, page: D.page, title: D.title, subtitle: D.subtitle });

// Công tắc chế độ: true khi là trang phí vận chuyển (data-mode="billing")
const BILLING = D.mode === "billing";

// Bộ lọc trạng thái đang được chọn, mặc định xem tất cả
let filter = "Tất cả";

// Viết tắt: $("q") tương đương document.getElementById("q")
const $ = (id) => document.getElementById(id);


// ===== 2. HIỂN THỊ BẢNG ĐƠN HÀNG =====
function render() {
  // Từ khóa tìm kiếm, đưa về chữ thường để không phân biệt hoa/thường
  const q = $("q").value.toLowerCase();

  // Giữ lại những đơn thỏa cả hai điều kiện:
  //  (1) đúng trạng thái đang lọc (hoặc đang chọn "Tất cả")
  //  (2) mã, tên hoặc địa chỉ có chứa từ khóa
  const list = ORDERS.filter((o) => (filter === "Tất cả" || o.status === filter) &&
    (o.code + o.name + o.address).toLowerCase().includes(q));

  // Xóa các dòng cũ để vẽ lại từ đầu
  $("rows").innerHTML = "";

  list.forEach((o, i) => {
    const tr = document.createElement("tr");

    // Dựng sẵn khung 6 ô, các ô chữ để trống rồi điền sau bằng textContent
    // (tránh chèn dữ liệu thẳng vào HTML để không bị tấn công XSS)
    // Cột 5: trang billing hiện phí ship (số giả lập), trang còn lại hiện "x phút trước"
    tr.innerHTML = `<td><strong></strong></td><td></td><td></td>
      <td><span class="badge badge-${BADGE_TONE[o.status]}"></span></td><td>${BILLING ? (32 + i * 6) + ".000đ" : (8 + i * 13) + " phút trước"}</td>
      <td><button class="text-btn">Xem <span class="bi bi-chevron-right"></span></button></td>`;

    // Điền dữ liệu thật vào từng ô
    tr.children[0].firstChild.textContent = o.code;      // Mã đơn (nằm trong thẻ <strong>)
    tr.children[1].textContent = o.name;                 // Người nhận
    tr.children[2].textContent = o.address;              // Địa chỉ
    tr.querySelector(".badge").textContent = o.status;   // Trạng thái

    // Nhấn "Xem" để mở cửa sổ chi tiết của đơn này
    tr.querySelector("button").onclick = () => showDetail(o);

    $("rows").appendChild(tr);
  });

  // Không có đơn nào khớp thì hiện thông báo "không có dữ liệu"
  $("empty").hidden = list.length > 0;
}


// ===== 3. VẼ CÁC NÚT LỌC =====
function renderFilters() {
  $("filters").innerHTML = "";

  ["Tất cả", "Đang giao", "Đã giao", "Ngoại lệ"].forEach((x) => {
    const b = document.createElement("button");

    // Nút đang chọn dùng kiểu "primary", các nút còn lại dùng "secondary"
    b.className = filter === x ? "primary" : "secondary";
    b.textContent = x;

    // Khi nhấn: đổi bộ lọc, vẽ lại nút (để đổi màu), rồi vẽ lại bảng
    b.onclick = () => { filter = x; renderFilters(); render(); };

    $("filters").appendChild(b);
  });
}


// ===== 4. CỬA SỔ CHI TIẾT ĐƠN HÀNG =====
function showDetail(o) {
  // openModal nhận chuỗi HTML, hiện popup và trả về phần tử popup đó
  const m = openModal(`
    <div class="panel-title"><div><span class="badge badge-${BADGE_TONE[o.status]}"></span><h2>Chi tiết giao hàng</h2><p></p></div>
      <button class="icon-button" id="x" aria-label="Đóng">×</button></div>
    <div class="case-meta"><div><span>Dịch vụ</span><strong>Giao tiêu chuẩn</strong></div>
      <div><span>Tài xế</span><strong>Nguyễn Văn Hùng</strong></div><div><span>Dự kiến</span><strong>14:30 – 15:15</strong></div></div>
    <div class="info-row"><span class="bi bi-geo-alt"></span><div><span>Địa chỉ nhận</span><strong id="addr"></strong></div></div>

    <!-- Chỉ hiện khối "Lý do ngoại lệ" khi đơn ở trạng thái Ngoại lệ -->
    ${o.status === "Ngoại lệ" ? `<div class="problem-detail"><span class="bi bi-exclamation-triangle"></span><div><strong>Lý do ngoại lệ</strong><p>Không tìm thấy địa chỉ giao. Điều phối viên đang liên hệ để xác minh.</p></div></div>` : ""}

    <!-- Chỉ hiện khối thời hạn đánh giá/khiếu nại khi đơn đã giao thành công -->
    ${o.status === "Đã giao" ? `<div class="eligibility"><span class="bi bi-clock"></span><div><strong>Còn 11 ngày để đánh giá hoặc khiếu nại</strong><p>Quyền này hết hạn sau 14 ngày kể từ khi giao thành công.</p></div></div>` : ""}

    <div class="form-actions"><button class="secondary" id="close">Đóng</button><button class="primary" id="copy">Sao chép mã đơn</button></div>`);

  // Điền dữ liệu bằng textContent cho an toàn
  m.querySelector(".badge").textContent = o.status;
  m.querySelector("p").textContent = o.code;
  m.querySelector("#addr").textContent = `${o.name}, ${o.address}`;

  // Nút × và nút "Đóng" cùng đóng popup
  m.querySelector("#x").onclick = m.querySelector("#close").onclick = closeModal;

  // Nút "Sao chép mã đơn": chép mã vào clipboard rồi hiện thông báo
  // (dấu ?. giúp không bị lỗi nếu trình duyệt không hỗ trợ clipboard)
  m.querySelector("#copy").onclick = () => {
    navigator.clipboard?.writeText(o.code);
    notify("Đã sao chép", "Mã vận đơn đã được sao chép.");
  };
}


// ===== 5. CHẠY LẦN ĐẦU =====
// Trang billing: đổi tiêu đề cột 5 thành "Phí vận chuyển"
if (BILLING) document.querySelector("th:nth-child(5)").textContent = "Phí vận chuyển";

// Gõ vào ô tìm kiếm là bảng được lọc lại ngay
$("q").addEventListener("input", render);

// Vẽ nút lọc và bảng lần đầu khi mở trang
renderFilters(); render();