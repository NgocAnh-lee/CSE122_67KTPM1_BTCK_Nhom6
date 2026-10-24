/* main.js - dùng chung: menu theo vai trò, kiểm tra đăng nhập, thông báo (toast). */
const ROLES = {
  recipient: { name: "Người nhận", short: "NH", pages: [
    ["recipient/track-parcel", "Theo dõi đơn", "bi-box-seam"],
    ["recipient/orders", "Đơn của tôi", "bi-inbox"],
    ["recipient/delivery-preferences", "Tuỳ chọn giao", "bi-sliders"],
    ["recipient/support", "Phản hồi sự cố", "bi-exclamation-triangle"],
    ["recipient/delivery-feedback", "Đánh giá", "bi-star"],
    ["recipient/notifications", "Thông báo", "bi-bell"]] },
  sender: { name: "Người gửi", short: "NG", pages: [
    ["sender/dashboard", "Tổng quan", "bi-grid"], ["sender/create", "Tạo đơn gửi", "bi-plus-lg"],
    ["sender/shipments", "Đơn đã gửi", "bi-box-seam"], ["sender/addresses", "Sổ địa chỉ", "bi-geo-alt"],
    ["sender/returns", "Đơn hoàn trả", "bi-arrow-return-left"], ["sender/billing", "Đối soát", "bi-graph-up"]] },
  driver: { name: "Nhân viên giao hàng", short: "TX", pages: [
    ["driver/dashboard", "Ca làm việc", "bi-grid"], ["driver/route-stops", "Lộ trình hôm nay", "bi-signpost-split"],
    ["driver/orders", "Danh sách đơn", "bi-inbox"], ["driver/stop-detail", "Chi tiết điểm dừng", "bi-geo-alt"],
    ["driver/proof", "Minh chứng giao hàng", "bi-check2-circle"], ["driver/exception-create", "Báo cáo ngoại lệ", "bi-exclamation-triangle"],
    ["driver/history", "Lịch sử ca", "bi-clock-history"]] },
  dispatcher: { name: "Điều phối viên", short: "ĐP", pages: [
    ["dispatcher/operations-dashboard", "Tổng quan vận hành", "bi-grid"], ["dispatcher/assignment", "Phân công đơn", "bi-people"],
    ["dispatcher/orders", "Tất cả đơn hàng", "bi-box-seam"], ["dispatcher/exception-queue", "Hàng đợi ngoại lệ", "bi-inbox"],
    ["dispatcher/reassignment", "Điều phối lại", "bi-people"], ["dispatcher/feedback", "Phản hồi người nhận", "bi-star"],
    ["dispatcher/driver-monitor", "Giám sát tài xế", "bi-signpost-split"]] },
  admin: { name: "Quản trị viên", short: "QT", pages: [
    ["admin/overview", "Tổng quan hệ thống", "bi-grid"], ["admin/status-management", "Quản lý trạng thái", "bi-tag"],
    ["admin/user-management", "Quản lý người dùng", "bi-people"], ["admin/proof-review", "Duyệt minh chứng", "bi-check2-circle"],
    ["admin/logistics-report", "Báo cáo logistics", "bi-graph-up"], ["admin/audit", "Nhật ký hệ thống", "bi-clock-history"],
    ["admin/settings", "Cấu hình hệ thống", "bi-sliders"]] },
};

const ROOT = document.body.dataset.root || "./";           // đường dẫn tới thư mục gốc dự án
const getSession = () => { try { return JSON.parse(localStorage.getItem("pp-session")); } catch { return null; } };
const logout = () => { localStorage.removeItem("pp-session"); location.href = ROOT + "pages/login.html"; };

/* Toast thông báo nổi */
function notify(title, detail) {
  document.querySelector(".toast")?.remove();
  const t = document.createElement("div");
  t.className = "toast";
  t.innerHTML = `<i><span class="bi bi-check-lg"></span></i><div><strong></strong><p></p></div><button aria-label="Đóng">×</button>`;
  t.querySelector("strong").textContent = title;
  t.querySelector("p").textContent = detail;
  t.querySelector("button").onclick = () => t.remove();
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 3200);
}

/* Dựng khung trang (sidebar + header) quanh #page-content.
   Gọi: initShell({ role: "recipient", page: "recipient/track-parcel", title, subtitle }) */
function initShell({ role, page, title, subtitle }) {
  const s = getSession();
  if (!s) { location.href = ROOT + "pages/login.html"; return; }
  if (s.role !== role) { location.href = ROOT + "pages/" + ROLES[s.role].pages[0][0] + ".html"; return; }
  const r = ROLES[role];
  const links = r.pages.map(([id, label, icon]) =>
    `<a class="nav-btn ${id === page ? "active" : ""}" href="${ROOT}pages/${id}.html"><span class="bi ${icon}"></span><span>${label}</span></a>`).join("");
  const options = r.pages.map(([id, label]) => `<option value="${id}" ${id === page ? "selected" : ""}>${label}</option>`).join("");
  const content = document.getElementById("page-content");
  const shell = document.createElement("div");
  shell.className = "app-shell";
  shell.innerHTML = `
    <aside class="sidebar">
      <div class="brand"><div><span class="bi bi-box-seam"></span></div><strong>ALQ <span>ship</span></strong></div>
      <div class="role-picker"><small>PHIÊN LÀM VIỆC HIỆN TẠI</small>
        <button><span>${r.short}</span><div><strong>${r.name}</strong><p>Vai trò đã xác thực</p></div></button></div>
      <nav>${links}</nav>
      <div class="sidebar-bottom"><button class="help" id="btn-logout"><span><span class="bi bi-box-arrow-left"></span></span>
        <div><strong>Đăng xuất</strong><p>Trở về trang đăng nhập</p></div></button></div>
    </aside>
    <div class="mobile-nav"><div class="brand"><strong>ALQ <span>ship</span></strong></div>
      <span class="mobile-role">${r.short}</span><select id="mobile-select">${options}</select>
      <button class="mobile-logout" id="btn-logout-m" aria-label="Đăng xuất"><span class="bi bi-box-arrow-left"></span></button></div>
    <main>
      <header class="page-header"><div><h1></h1><p></p></div>
        <div class="header-actions"><button class="icon-button" id="btn-bell" aria-label="Thông báo"><span class="bi bi-bell"></span><span class="notify-dot"></span></button>
        <div class="avatar">${r.short}</div></div></header>
    </main>`;
  shell.querySelector("h1").textContent = title;
  shell.querySelector("header p").textContent = subtitle;
  shell.querySelector("main").appendChild(content);
  document.body.prepend(shell);
  shell.querySelector("#btn-logout").onclick = logout;
  shell.querySelector("#btn-logout-m").onclick = logout;
  shell.querySelector("#mobile-select").onchange = (e) => (location.href = ROOT + "pages/" + e.target.value + ".html");
  shell.querySelector("#btn-bell").onclick = () => notify("Thông báo", "Bạn có 2 cập nhật mới.");
}

/* Modal dùng chung - dùng component Modal của Bootstrap 5.
   openModal(htmlString) trả về phần tử modal (dùng .querySelector bên trong); closeModal() để đóng. */
let currentModal = null;
function openModal(html) {
  closeModal();
  const el = document.createElement("div");
  el.className = "modal fade";
  el.tabIndex = -1;
  el.innerHTML = `<div class="modal-dialog modal-dialog-centered modal-dialog-scrollable"><div class="modal-content"><div class="modal-body">${html}</div></div></div>`;
  document.body.appendChild(el);
  const instance = new bootstrap.Modal(el);
  el.addEventListener("hidden.bs.modal", () => { instance.dispose(); el.remove(); if (currentModal === instance) currentModal = null; });
  currentModal = instance;
  instance.show();
  return el;
}
function closeModal() { currentModal?.hide(); }
const BADGE_TONE = { "Đã giao": "green", "Ngoại lệ": "red", "Đang giao": "blue", "Chờ lấy": "gray" };
