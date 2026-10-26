/* orders.js - dùng chung cho Người nhận / Người gửi / Điều phối (cấu hình bằng data-* trên <body>).
   - tìm kiếm, lọc theo trạng thái, xem chi tiết (modal). */
const D = document.body.dataset;
initShell({ role: D.role, page: D.page, title: D.title, subtitle: D.subtitle });
const BILLING = D.mode === "billing";   // trang đối soát: cột 5 là phí vận chuyển
let filter = "Tất cả";
const $ = (id) => document.getElementById(id);

function render() {
  const q = $("q").value.toLowerCase();
  const list = ORDERS.filter((o) => (filter === "Tất cả" || o.status === filter) &&
    (o.code + o.name + o.address).toLowerCase().includes(q));
  $("rows").innerHTML = "";
  list.forEach((o, i) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `<td><strong></strong></td><td></td><td></td>
      <td><span class="badge badge-${BADGE_TONE[o.status]}"></span></td><td>${BILLING ? (32 + i * 6) + ".000đ" : (8 + i * 13) + " phút trước"}</td>
      <td><button class="text-btn">Xem <span class="bi bi-chevron-right"></span></button></td>`;
    tr.children[0].firstChild.textContent = o.code;
    tr.children[1].textContent = o.name;
    tr.children[2].textContent = o.address;
    tr.querySelector(".badge").textContent = o.status;
    tr.querySelector("button").onclick = () => showDetail(o);
    $("rows").appendChild(tr);
  });
  $("empty").hidden = list.length > 0;
}
function renderFilters() {
  $("filters").innerHTML = "";
  ["Tất cả", "Đang giao", "Đã giao", "Ngoại lệ"].forEach((x) => {
    const b = document.createElement("button");
    b.className = filter === x ? "primary" : "secondary";
    b.textContent = x;
    b.onclick = () => { filter = x; renderFilters(); render(); };
    $("filters").appendChild(b);
  });
}
function showDetail(o) {
  const m = openModal(`
    <div class="panel-title"><div><span class="badge badge-${BADGE_TONE[o.status]}"></span><h2>Chi tiết giao hàng</h2><p></p></div>
      <button class="icon-button" id="x" aria-label="Đóng">×</button></div>
    <div class="case-meta"><div><span>Dịch vụ</span><strong>Giao tiêu chuẩn</strong></div>
      <div><span>Tài xế</span><strong>Nguyễn Văn Hùng</strong></div><div><span>Dự kiến</span><strong>14:30 – 15:15</strong></div></div>
    <div class="info-row"><span class="bi bi-geo-alt"></span><div><span>Địa chỉ nhận</span><strong id="addr"></strong></div></div>
    ${o.status === "Ngoại lệ" ? `<div class="problem-detail"><span class="bi bi-exclamation-triangle"></span><div><strong>Lý do ngoại lệ</strong><p>Không tìm thấy địa chỉ giao. Điều phối viên đang liên hệ để xác minh.</p></div></div>` : ""}
    ${o.status === "Đã giao" ? `<div class="eligibility"><span class="bi bi-clock"></span><div><strong>Còn 11 ngày để đánh giá hoặc khiếu nại</strong><p>Quyền này hết hạn sau 14 ngày kể từ khi giao thành công.</p></div></div>` : ""}
    <div class="form-actions"><button class="secondary" id="close">Đóng</button><button class="primary" id="copy">Sao chép mã đơn</button></div>`);
  m.querySelector(".badge").textContent = o.status;
  m.querySelector("p").textContent = o.code;
  m.querySelector("#addr").textContent = `${o.name}, ${o.address}`;
  m.querySelector("#x").onclick = m.querySelector("#close").onclick = closeModal;
  m.querySelector("#copy").onclick = () => { navigator.clipboard?.writeText(o.code); notify("Đã sao chép", "Mã vận đơn đã được sao chép."); };
}
if (BILLING) document.querySelector("th:nth-child(5)").textContent = "Phí vận chuyển";
$("q").addEventListener("input", render);
renderFilters(); render();
