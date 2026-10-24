/* admin-user-management.js - lọc theo vai trò, tìm kiếm, khoá/mở khoá (cần lý do), xử lý khiếu nại, duyệt người dùng đăng ký mới. */
initShell({ role: "admin", page: "admin/user-management", title: "Quản lý người dùng", subtitle: "Phân nhóm tài khoản và xét duyệt người dùng mới" });
const $ = (id) => document.getElementById(id);
const BASE = [["Nguyễn Văn Hùng", "hung.nv@alqship.vn", "Tài xế", "CG-04"], ["Trần Thu Trang", "trang.tt@alqship.vn", "Điều phối viên", "Hà Nội"],
  ["Lê Minh Anh", "anh.lm@alqship.vn", "Tài xế", "BD-11"], ["Phạm Quốc Bảo", "bao.pq@alqship.vn", "Quản trị viên", "Toàn hệ thống"],
  ["Vũ Hoàng Nam", "nam.vh@alqship.vn", "Tài xế", "HK-02"], ["Minh Shop", "minh.shop@alqship.vn", "Người gửi", "Hà Nội"],
  ["Nguyễn Thu Hà", "ha.nt@alqship.vn", "Người nhận", "Cầu Giấy"]];
const PENDING0 = [["Nguyễn Văn An", "an.nv@alqship.vn", "0123456789", "Cầu Giấy", "Tài xế"], ["Lê Thu Hương", "huong.lt@alqship.vn", "0123456789", "Ba Đình", "Người gửi"],
  ["Trần Minh Khoa", "khoa.tm@alqship.vn", "0123456789", "Nam Từ Liêm", "Người nhận"]];
const TABS = ["Tất cả", "Tài xế", "Điều phối viên", "Quản trị viên", "Người gửi", "Người nhận"];
let st = JSON.parse(localStorage.getItem("pp-users-state") || "null") || { locked: { "anh.lm@alqship.vn": true }, appeal: { "anh.lm@alqship.vn": true }, extra: [], approved: [] };
const save = () => localStorage.setItem("pp-users-state", JSON.stringify(st));
const users = () => [...BASE, ...st.extra];
const pending = () => [...PENDING0, ...JSON.parse(localStorage.getItem("pp-pending-users") || "[]")].filter((p) => !st.approved.includes(p[1]));
JSON.parse(localStorage.getItem("pp-appeals") || "[]").forEach((a) => users().forEach((u) => { if (u[1] === a.contact) st.appeal[u[1]] = true; }));
let tab = "Tất cả";
const initials = (n) => n.split(" ").slice(-2).map((x) => x[0]).join("");

function render() {
  const q = $("q").value.toLowerCase();
  $("tabs").innerHTML = "";
  TABS.forEach((t) => {
    const b = document.createElement("button"); b.className = tab === t ? "active" : "";
    b.innerHTML = `${t}<span>${t === "Tất cả" ? users().length : users().filter((u) => u[2] === t).length}</span>`;
    b.onclick = () => { tab = t; render(); }; $("tabs").appendChild(b);
  });
  $("pending-count").textContent = pending().length;
  $("rows").innerHTML = "";
  const rows = users().filter((u) => u.join(" ").toLowerCase().includes(q) && (tab === "Tất cả" || u[2] === tab));
  $("empty").hidden = rows.length > 0;
  rows.forEach((u) => {
    const lock = st.locked[u[1]], tr = document.createElement("tr");
    tr.innerHTML = `<td><div class="user-cell"><div class="avatar small"></div><div><strong></strong><span></span></div></div></td><td></td><td></td>
      <td><span class="badge badge-${lock ? "gray" : "green"}">${lock ? "Tạm khoá" : "Hoạt động"}</span> ${st.appeal[u[1]] ? '<span class="badge badge-orange">CÓ KHIẾU NẠI</span>' : ""}</td><td>12 phút trước</td>
      <td><button class="icon-button" aria-label="Kiểm tra tài khoản"><span class="bi bi-three-dots"></span></button></td>`;
    tr.querySelector(".avatar").textContent = initials(u[0]); tr.querySelector("strong").textContent = u[0]; tr.querySelector(".user-cell span").textContent = u[1];
    tr.children[1].textContent = u[2]; tr.children[2].textContent = u[3];
    tr.querySelector("button").onclick = () => review(u);
    $("rows").appendChild(tr);
  });
}
function review(u) {
  const lock = st.locked[u[1]];
  const m = openModal(`<div class="panel-title"><div><span class="badge badge-${lock ? "red" : "green"}">${lock ? "TẠM KHOÁ" : "ĐANG HOẠT ĐỘNG"}</span><h2>Kiểm tra tài khoản</h2><p></p></div><button class="icon-button" data-bs-dismiss="modal" aria-label="Đóng">×</button></div>
    <div class="case-meta"><div><span>Vai trò</span><strong></strong></div><div><span>Phạm vi</span><strong></strong></div><div><span>Số điện thoại</span><strong>0123456789</strong></div></div>
    <div class="audit-summary"><strong>Kết quả kiểm tra gần nhất</strong><p>Đã xác minh thông tin liên hệ. Có 2 lần đăng nhập trên thiết bị mới, không phát hiện truy cập trái phép.</p></div>
    ${st.appeal[u[1]] ? '<div class="eligibility"><span class="bi bi-exclamation-triangle"></span><div><strong>Khiếu nại mở khoá từ người dùng</strong><p>“Tôi đã bổ sung giấy tờ xác minh và đề nghị quản trị viên kiểm tra lại tài khoản.”</p></div></div>' : ""}
    ${lock ? "" : '<label class="field-label">Lý do khoá tài khoản<textarea id="reason" placeholder="Mô tả sai phạm để người dùng có thể khiếu nại..."></textarea></label>'}
    <div class="form-actions"><button class="secondary" data-bs-dismiss="modal">${lock ? "Giữ khoá" : "Đóng"}</button>
      ${lock ? '<button class="primary" id="unlock">Chấp nhận và mở lại</button>' : '<button class="danger-outline" id="lock" disabled>Khoá tài khoản</button>'}</div>`);
  m.querySelector("p").textContent = `${u[0]} · ${u[1]}`;
  const strongs = m.querySelectorAll(".case-meta strong"); strongs[0].textContent = u[2]; strongs[1].textContent = u[3];
  m.querySelector("#unlock")?.addEventListener("click", () => { delete st.locked[u[1]]; delete st.appeal[u[1]]; save(); render(); closeModal(); notify("Đã mở lại tài khoản", `${u[0]} có thể đăng nhập trở lại.`); });
  const reason = m.querySelector("#reason");
  reason?.addEventListener("input", () => (m.querySelector("#lock").disabled = reason.value.trim().length < 10));
  m.querySelector("#lock")?.addEventListener("click", () => { st.locked[u[1]] = reason.value.trim(); save(); render(); closeModal(); notify("Đã khoá tài khoản", "Lý do: " + reason.value.trim()); });
}
$("pending-btn").onclick = () => {
  const list = pending();
  const m = openModal(`<div class="panel-title"><div><span class="badge badge-orange">${list.length} ĐANG CHỜ</span><h2>Hàng đợi người dùng mới</h2><p>Kiểm tra thông tin và duyệt vai trò người dùng đã đăng ký</p></div><button class="icon-button" data-bs-dismiss="modal" aria-label="Đóng">×</button></div><div id="plist"></div>`);
  if (!list.length) m.querySelector("#plist").innerHTML = '<div class="empty-inline">Không còn yêu cầu nào.</div>';
  list.forEach((p) => {
    const d = document.createElement("div"); d.className = "pending-user";
    d.innerHTML = `<div class="avatar small"></div><div><strong></strong><p></p><span></span></div><button class="primary">Duyệt</button>`;
    d.querySelector(".avatar").textContent = initials(p[0]); d.querySelector("strong").textContent = p[0];
    d.querySelector("p").textContent = `${p[1]} · ${p[2]}`; d.querySelector("span").textContent = `${p[3]} · Vai trò đăng ký: ${p[4]}`;
    d.querySelector("button").onclick = () => {
      st.approved.push(p[1]); st.extra.push([p[0], p[1], p[4], p[3]]); save(); render(); closeModal();
      notify("Đã duyệt người dùng", `${p[0]} được duyệt với vai trò ${p[4]}.`);
    };
    m.querySelector("#plist").appendChild(d);
  });
};
$("q").addEventListener("input", render);
render();
