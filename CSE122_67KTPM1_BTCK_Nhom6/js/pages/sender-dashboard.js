/* sender-dashboard.js - lối tắt và bảng đơn gần đây. */
initShell({ role: "sender", page: "sender/dashboard", title: "Chào buổi chiều, Minh Shop", subtitle: "Tổng quan hoạt động gửi hàng hôm nay" });
const $ = (id) => document.getElementById(id);
document.querySelectorAll("[data-go]").forEach((b) => (b.onclick = () => (location.href = b.dataset.go + ".html")));
const mine = JSON.parse(localStorage.getItem("pp-shipments") || "[]");        // đơn vừa tạo ở trang "Tạo đơn gửi"
const rows = [...mine.map((m) => ({ code: m.code, name: m.name, address: m.address, status: "Chờ lấy" })), ...ORDERS].slice(0, 5);
$("recent-sub").textContent = rows.length + " cập nhật mới nhất";
rows.forEach((o) => {
  const tr = document.createElement("tr");
  tr.innerHTML = `<td><strong></strong></td><td></td><td></td><td><span class="badge badge-${BADGE_TONE[o.status]}"></span></td>`;
  tr.children[0].firstChild.textContent = o.code; tr.children[1].textContent = o.name; tr.children[2].textContent = o.address; tr.querySelector(".badge").textContent = o.status;
  $("rows").appendChild(tr);
});
