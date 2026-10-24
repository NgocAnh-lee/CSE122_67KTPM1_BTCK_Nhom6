/* admin-status-management.js - danh sách trạng thái: tìm kiếm, thêm mới (có kiểm tra), xem chi tiết bằng modal Bootstrap. */
initShell({ role: "admin", page: "admin/status-management", title: "Quản lý trạng thái", subtitle: "Thiết lập vòng đời và quy tắc hiển thị đơn hàng" });
const $ = (id) => document.getElementById(id);
const DESC = {
  "Chờ lấy hàng": "Người gửi đã tạo vận đơn, tài xế chưa nhận kiện", "Đã lấy hàng": "Kiện hàng đã được bàn giao cho đơn vị vận chuyển",
  "Đang vận chuyển": "Đơn đang luân chuyển giữa các kho hoặc khu vực", "Đang giao": "Tài xế đang mang đơn đến địa chỉ người nhận",
  "Đã giao": "Tài xế xác nhận thành công và đã gửi minh chứng", "Ngoại lệ": "Đơn gặp sự cố như sai địa chỉ, khách vắng hoặc hư hỏng",
  "Đã huỷ": "Đơn đã dừng xử lý và không tiếp tục giao" };
let list = JSON.parse(localStorage.getItem("pp-statuses") || "null") || Object.keys(DESC);
const save = () => localStorage.setItem("pp-statuses", JSON.stringify(list));
const desc = (s) => DESC[s] || "Trạng thái tuỳ chỉnh do quản trị viên thiết lập";

function render() {
  const q = $("q").value.toLowerCase();
  $("list").innerHTML = "";
  list.forEach((s, i) => {
    if (!s.toLowerCase().includes(q)) return;
    const off = s === "Đã huỷ", row = document.createElement("div");
    row.className = "status-row";
    row.innerHTML = `<span class="drag">⠿</span><i class="color-dot c${i % 7}"></i><div><strong></strong><p></p></div><span class="badge badge-${off ? "gray" : "green"}">${off ? "VÔ HIỆU" : "ĐANG DÙNG"}</span><button class="icon-button" aria-label="Xem chi tiết"><span class="bi bi-three-dots"></span></button>`;
    row.querySelector("strong").textContent = s; row.querySelector("p").textContent = desc(s);
    row.querySelector("button").onclick = () => detail(s, off);
    $("list").appendChild(row);
  });
  $("count").textContent = list.length + " trạng thái hệ thống";
  if (!$("list").children.length) $("list").innerHTML = '<div class="empty-inline">Không tìm thấy trạng thái.</div>';
}
function detail(s, off) {
  const m = openModal(`<div class="panel-title"><div><span class="badge badge-${off ? "gray" : "green"}">${off ? "VÔ HIỆU" : "ĐANG DÙNG"}</span><h2></h2><p>Chi tiết trạng thái giao hàng</p></div><button class="icon-button" data-bs-dismiss="modal" aria-label="Đóng">×</button></div>
    <div class="driver-note"><strong>Ý nghĩa</strong><p></p></div>
    <div class="case-meta"><div><span>Hiển thị với khách hàng</span><strong>Có</strong></div><div><span>Thông báo tự động</span><strong>Đã bật</strong></div><div><span>Cập nhật cuối</span><strong>19/05/2025</strong></div></div>
    <div class="form-actions"><button class="primary" data-bs-dismiss="modal">Đóng</button></div>`);
  m.querySelector("h2").textContent = s; m.querySelector(".driver-note p").textContent = desc(s);
}
$("add").onclick = () => {
  const m = openModal(`<h2 class="fs-5">Thêm trạng thái mới</h2><label class="field-label">Tên trạng thái *<input id="new-name" maxlength="30"></label>
    <div class="text-danger small" id="new-err" hidden></div><div class="form-actions"><button class="secondary" data-bs-dismiss="modal">Huỷ</button><button class="primary" id="new-ok">Thêm</button></div>`);
  m.querySelector("#new-ok").onclick = () => {
    const v = m.querySelector("#new-name").value.trim(), err = m.querySelector("#new-err");
    if (v.length < 2) { err.textContent = "Tên cần ít nhất 2 ký tự."; err.hidden = false; return; }
    if (list.some((x) => x.toLowerCase() === v.toLowerCase())) { err.textContent = "Trạng thái này đã tồn tại."; err.hidden = false; return; }
    list.push(v); save(); render(); closeModal(); notify("Đã thêm trạng thái", v);
  };
};
$("q").addEventListener("input", render);
render();
