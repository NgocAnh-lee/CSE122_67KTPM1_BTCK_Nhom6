/* admin-proof-review.js - duyệt hoặc yêu cầu gửi lại minh chứng; hiện cả hồ sơ tài xế vừa gửi ở trang Minh chứng. */
initShell({ role: "admin", page: "admin/proof-review", title: "Duyệt minh chứng giao hàng", subtitle: "Hồ sơ đang chờ quản trị viên kiểm tra" });
const $ = (id) => document.getElementById(id);
const BASE = [["PPVN-8041-2836", "Nguyễn Văn Hùng", "10:42", "Nguyễn Thu Hà", "24 Duy Tân, Cầu Giấy"],
  ["PPVN-7153-9021", "Trần Minh Đức", "11:18", "Nguyễn Thu Hà", "24 Duy Tân, Cầu Giấy"], ["PPVN-6330-1842", "Lê Quốc Anh", "12:05", "Nguyễn Thu Hà", "24 Duy Tân, Cầu Giấy"]];
const sent = JSON.parse(localStorage.getItem("pp-proofs") || "[]").map((p) => [p.order.split(" ")[0], "Nguyễn Văn Hùng", "vừa gửi", "Theo đơn", "Tuyến CG-04"]);
const items = [...BASE, ...sent];
let reviewed = JSON.parse(localStorage.getItem("pp-proof-review") || "{}");
function render() {
  $("grid").innerHTML = "";
  const waiting = items.filter((x, i) => !reviewed[x[0] + i]).length;
  document.querySelector("header p").textContent = `${waiting} hồ sơ đang chờ quản trị viên kiểm tra`;
  $("empty").hidden = items.length > 0;
  items.forEach((x, i) => {
    const key = x[0] + i, r = reviewed[key], sec = document.createElement("section");
    sec.className = "panel";
    sec.innerHTML = `<div class="proof-image"><span class="bi bi-box-seam fs-1"></span><span class="badge badge-gray">ẢNH MINH CHỨNG</span></div><h3></h3><p></p>
      <div class="proof-meta"><span>Người nhận</span><strong></strong><span>Vị trí</span><strong></strong></div>
      ${r ? `<span class="badge badge-${r === "Duyệt" ? "green" : "red"}">${r.toUpperCase()}</span>` : '<div class="proof-actions"><button data-a="Từ chối">Yêu cầu gửi lại</button><button data-a="Duyệt">Duyệt</button></div>'}`;
    sec.querySelector("h3").textContent = x[0]; sec.querySelector("p").textContent = `Tài xế: ${x[1]} · Gửi lúc ${x[2]}`;
    const s = sec.querySelectorAll(".proof-meta strong"); s[0].textContent = x[3]; s[1].textContent = x[4];
    sec.querySelectorAll("[data-a]").forEach((b) => (b.onclick = () => {
      reviewed[key] = b.dataset.a; localStorage.setItem("pp-proof-review", JSON.stringify(reviewed)); render();
      notify(b.dataset.a === "Duyệt" ? "Đã duyệt minh chứng" : "Đã từ chối minh chứng", b.dataset.a === "Duyệt" ? `${x[0]} được xác nhận hoàn thành.` : "Tài xế sẽ nhận được yêu cầu gửi lại ảnh.");
    }));
    $("grid").appendChild(sec);
  });
}
render();
