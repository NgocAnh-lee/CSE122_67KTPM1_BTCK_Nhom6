/* notifications.js - danh sách thông báo, đánh dấu đã đọc (lưu LocalStorage). */
initShell({ role: "recipient", page: "recipient/notifications", title: "Trung tâm thông báo", subtitle: "" });
const ITEMS = [
  ["Đơn hàng đang trên đường giao", "Tài xế Nguyễn Văn Hùng dự kiến đến trong 35 phút.", "5 phút", "bi-truck"],
  ["Yêu cầu đổi lịch đã được chấp nhận", "Đơn PPVN-7153-9021 sẽ được giao lại từ 17:00–20:00.", "1 giờ", "bi-clock"],
  ["Đơn hàng đã được giao thành công", "Hãy kiểm tra kiện hàng và gửi đánh giá cho chúng tôi.", "Hôm qua", "bi-check-lg"],
];
let read = [];
try { read = JSON.parse(localStorage.getItem("pp-read")) || []; } catch {}
function render() {
  const list = document.getElementById("list"); list.innerHTML = "";
  document.querySelector("header p").textContent = `${ITEMS.length - read.length} thông báo chưa đọc`;
  ITEMS.forEach((x, i) => {
    const b = document.createElement("button");
    b.className = read.includes(i) ? "read" : "";
    b.innerHTML = `<i><span class="bi ${x[3]}"></span></i><div><h3></h3><p></p><span></span></div>${read.includes(i) ? "" : "<b></b>"}`;
    b.querySelector("h3").textContent = x[0]; b.querySelector("p").textContent = x[1]; b.querySelector("span:not(.bi)").textContent = x[2];
    b.onclick = () => { if (!read.includes(i)) save([...read, i]); notify(x[0], x[1]); };
    list.appendChild(b);
  });
}
function save(r) { read = r; localStorage.setItem("pp-read", JSON.stringify(r)); render(); }
document.getElementById("read-all").onclick = () => { save(ITEMS.map((_, i) => i)); notify("Đã đọc tất cả", "Mọi thông báo đã được đánh dấu."); };
render();
