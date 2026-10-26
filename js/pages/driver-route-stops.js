/* driver-route-stops.js - tìm điểm dừng, chọn trên danh sách hoặc bản đồ, xem chi tiết, chỉ đường. */
initShell({ role: "driver", page: "driver/route-stops", title: "Lộ trình hôm nay", subtitle: "Thứ Hai, 19 tháng 5 · Tuyến CG-04" });
const $ = (id) => document.getElementById(id);
let selected = 3, guiding = false;
function render() {
  const q = $("q").value.toLowerCase();
  const list = STOPS.map((s, i) => ({ s, i })).filter(({ s }) => (s.name + s.address).toLowerCase().includes(q));
  $("count").textContent = list.length + " kết quả";
  $("stops").innerHTML = "";
  list.forEach(({ s, i }) => {
    const b = document.createElement("button");
    b.className = "stop-item " + (i === selected ? "current" : "");
    b.innerHTML = `<span class="stop-time">${s.time}</span><i class="stop-dot"></i><div><h4></h4><p></p><span class="badge badge-${s.tone}"></span></div><span class="bi bi-chevron-right"></span>`;
    b.querySelector("h4").textContent = s.name; b.querySelector("p").textContent = s.address; b.querySelector(".badge").textContent = s.status;
    b.onclick = () => { selected = i; guiding = false; render(); };
    $("stops").appendChild(b);
  });
  $("pins").innerHTML = "";
  STOPS.forEach((_, i) => {
    const p = document.createElement("button");
    p.className = `map-pin pin-${i} ${i === selected ? "active" : ""}`; p.textContent = i + 1; p.setAttribute("aria-label", "Điểm " + (i + 1));
    p.onclick = () => { selected = i; guiding = false; render(); };
    $("pins").appendChild(p);
  });
  const s = STOPS[selected];
  $("c-name").textContent = s.name; $("c-addr").textContent = s.address;
  $("c-badge").className = "badge badge-" + s.tone; $("c-badge").textContent = s.status;
  $("c-km").textContent = (selected === 3 ? "2.1" : "1.4") + " km"; $("c-min").textContent = (selected === 3 ? "8" : "5") + " phút"; $("c-time").textContent = s.time;
  $("guide").hidden = !guiding; $("c-actions").hidden = guiding;
  $("g-title").textContent = `Đang chỉ đường đến điểm ${selected + 1}`;
}
function startGuide() { guiding = true; render(); notify("Bắt đầu chỉ đường", `Đang dẫn đường đến ${STOPS[selected].name}.`); }
$("q").addEventListener("input", render);
$("optimize").onclick = () => notify("Đã tối ưu lộ trình", "Tiết kiệm dự kiến 18 phút.");
$("c-go").onclick = startGuide;
$("c-view").onclick = () => {
  const s = STOPS[selected];
  const m = openModal(`<div class="panel-title"><div><span class="badge badge-${s.tone}"></span><h2></h2><p>Điểm dừng ${selected + 1} · ${s.code}</p></div><button class="icon-button" id="x" aria-label="Đóng">×</button></div>
    <div class="info-row"><span class="bi bi-geo-alt"></span><div><span>Địa chỉ giao</span><strong id="a"></strong></div></div>
    <div class="info-row"><span class="bi bi-telephone"></span><div><span>Số điện thoại</span><strong>0123456789</strong></div><a class="secondary" href="tel:0123456789">Gọi ngay</a></div>
    <div class="note"><strong>Ghi chú từ người nhận</strong><p>${selected === 3 ? "Gọi trước 5 phút. Vui lòng để xe ở sảnh B." : "Gọi cho khách khi tới điểm giao. Không giao cho người lạ."}</p></div>
    <div class="form-actions"><button class="secondary" id="close">Đóng</button><button class="primary" id="go">Chỉ đường đến đây</button></div>`);
  m.querySelector(".badge").textContent = s.status; m.querySelector("h2").textContent = s.name; m.querySelector("#a").textContent = s.address + ", Hà Nội";
  m.querySelector("#x").onclick = m.querySelector("#close").onclick = closeModal;
  m.querySelector("#go").onclick = () => { closeModal(); startGuide(); };
};
render();
