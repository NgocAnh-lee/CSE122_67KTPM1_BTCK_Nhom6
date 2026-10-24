/* driver-orders.js - tích hoàn thành đơn (lưu LocalStorage), xem chi tiết, dẫn sang trang minh chứng. */
initShell({ role: "driver", page: "driver/orders", title: "Danh sách đơn được giao", subtitle: "4 đơn trên tuyến CG-04" });
const $ = (id) => document.getElementById(id);
let done = getDone();
function render() {
  $("list").innerHTML = "";
  STOPS.slice(0, 4).forEach((o, i) => {
    const ok = done.includes(i), cur = i === 2;
    const sec = document.createElement("section");
    sec.className = "panel " + (ok ? "completed" : "");
    sec.innerHTML = `<button class="complete-check" aria-label="Đánh dấu hoàn thành">${ok ? '<span class="bi bi-check-lg"></span>' : ""}</button>
      <div><span class="badge badge-${ok ? "green" : cur ? "blue" : "gray"}">${ok ? "HOÀN THÀNH" : cur ? "ĐANG GIAO" : "CHỜ GIAO"}</span><h3></h3><p></p></div>
      <div class="order-actions"><button class="secondary" data-a="view">Xem chi tiết</button>${ok ? '<a class="btn btn-primary btn-sm" href="proof.html">Gửi minh chứng</a>' : ""}</div>`;
    sec.querySelector("h3").textContent = o.name;
    sec.querySelector("p").textContent = `${o.code} · ${o.address} · ${o.time}`;
    sec.querySelector(".complete-check").onclick = () => {
      done = ok ? done.filter((x) => x !== i) : [...done, i]; setDone(done); render();
      if (!ok) notify("Đã tích hoàn thành", "Hãy tải ảnh minh chứng để gửi quản lý duyệt.");
    };
    sec.querySelector('[data-a="view"]').onclick = () => {
      const m = openModal(`<div class="panel-title"><div><span class="badge badge-${ok ? "green" : "blue"}">${ok ? "HOÀN THÀNH" : "ĐƯỢC PHÂN CÔNG"}</span><h2></h2><p></p></div><button class="icon-button" id="x" aria-label="Đóng">×</button></div>
        <div class="info-row"><span class="bi bi-geo-alt"></span><div><span>Địa chỉ giao</span><strong id="a"></strong></div></div>
        <div class="case-meta"><div><span>Dự kiến</span><strong>${o.time}</strong></div><div><span>Kiện hàng</span><strong>1.8 kg</strong></div><div><span>Thu hộ</span><strong>0đ</strong></div></div>
        <div class="form-actions"><button class="secondary" id="close">Đóng</button><a class="btn btn-primary" href="route-stops.html">Xem lộ trình</a></div>`);
      m.querySelector("h2").textContent = o.name; m.querySelector("p").textContent = o.code; m.querySelector("#a").textContent = o.address + ", Hà Nội";
      m.querySelector("#x").onclick = m.querySelector("#close").onclick = closeModal;
    };
    $("list").appendChild(sec);
  });
}
render();
