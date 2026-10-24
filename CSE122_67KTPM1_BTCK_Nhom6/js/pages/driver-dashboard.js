/* driver-dashboard.js - bắt đầu/kết thúc ca, lối tắt, đánh giá gần đây. */
initShell({ role: "driver", page: "driver/dashboard", title: "Ca làm việc", subtitle: "Tuyến CG-04 · Khu vực phụ trách Cầu Giấy" });
const $ = (id) => document.getElementById(id);
let online = localStorage.getItem("pp-shift") === "on";
function renderShift() {
  $("shift").classList.toggle("online", online);
  $("shift-badge").className = "badge " + (online ? "badge-green" : "badge-gray");
  $("shift-badge").textContent = online ? "ĐANG HOẠT ĐỘNG" : "CHƯA BẮT ĐẦU";
  $("shift-title").textContent = online ? "Chúc bạn một ca giao an toàn!" : "Sẵn sàng bắt đầu ca hôm nay?";
  $("shift-btn").textContent = online ? "Kết thúc ca" : "Bắt đầu ca giao hàng";
}
$("shift-btn").onclick = () => {
  online = !online; localStorage.setItem("pp-shift", online ? "on" : "off"); renderShift();
  notify(online ? "Đã bắt đầu ca" : "Đã kết thúc ca", online ? "Chúc bạn giao hàng thuận lợi." : "Cảm ơn bạn đã hoàn thành ca.");
};
document.querySelectorAll("[data-go]").forEach((b) => (b.onclick = () => (location.href = b.dataset.go + ".html")));
[["Phạm Minh Phương", 5, "Giao đúng giờ, tài xế thân thiện.", "Hôm nay"], ["Nguyễn Thu Hà", 5, "Kiện hàng nguyên vẹn, bàn giao cẩn thận.", "Hôm qua"],
 ["Lê Hải Anh", 4, "Phục vụ tốt nhưng đến muộn 10 phút.", "16/05"]].forEach(([n, s, c, t]) => {
  const d = document.createElement("div"); d.className = "rating-row";
  d.innerHTML = `<div class="avatar small"></div><div><strong></strong><span>${"★".repeat(s)}${"☆".repeat(5 - s)}</span><p></p></div><time></time>`;
  d.querySelector(".avatar").textContent = n.split(" ").slice(-2).map((x) => x[0]).join("");
  d.querySelector("strong").textContent = n; d.querySelector("p").textContent = c; d.querySelector("time").textContent = t;
  $("ratings").appendChild(d);
});
$("done-count").textContent = 7 + getDone().length;
renderShift();
