/* sender-create.js - form 4 bước: kiểm tra hợp lệ từng bước, chọn dịch vụ, tạo vận đơn (lưu LocalStorage). */
initShell({ role: "sender", page: "sender/create", title: "Tạo đơn gửi mới", subtitle: "Nhập đầy đủ thông tin để tạo vận đơn" });
const $ = (id) => document.getElementById(id);
const STEPS = ["Người nhận", "Kiện hàng", "Dịch vụ", "Xác nhận"];
const SERVICES = [{ id: "std", name: "Giao tiêu chuẩn", note: "1–2 ngày · Dự kiến 21/05", fee: 32000, icon: "bi-truck" },
                  { id: "exp", name: "Giao hoả tốc", note: "Trong ngày · Trước 20:00", fee: 58000, icon: "bi-stars" }];
let step = 1, service = "std";
const fmt = (n) => n.toLocaleString("vi-VN") + "đ";
const val = (id) => $(id).value.trim();

function renderServices() {
  $("services").innerHTML = "";
  SERVICES.forEach((s) => {
    const b = document.createElement("button");
    b.type = "button"; b.className = service === s.id ? "selected" : "";
    b.innerHTML = `<span class="bi ${s.icon} fs-4"></span><div><strong></strong><p></p></div><b></b>`;
    b.querySelector("strong").textContent = s.name; b.querySelector("p").textContent = s.note; b.querySelector("b").textContent = fmt(s.fee);
    b.onclick = () => { service = s.id; renderServices(); render(); };
    $("services").appendChild(b);
  });
}
function check() {                       // trả về thông báo lỗi hoặc "" nếu hợp lệ
  if (step === 1) {
    if (val("rname").length < 2) return "Vui lòng nhập họ và tên người nhận.";
    if (!/^0\d{9}$/.test(val("rphone"))) return "Số điện thoại phải gồm 10 chữ số, bắt đầu bằng 0.";
    if (val("raddr").length < 8) return "Địa chỉ cần ghi chi tiết hơn.";
  }
  if (step === 2) {
    if (!val("pname")) return "Vui lòng nhập tên hàng hoá.";
    if (!(parseFloat($("pweight").value) > 0)) return "Khối lượng phải lớn hơn 0.";
  }
  return "";
}
function render() {
  document.querySelectorAll("[data-step]").forEach((d) => (d.hidden = +d.dataset.step !== step));
  $("flow").innerHTML = STEPS.map((x, i) => `<div class="flow-step ${step > i + 1 ? "done" : step === i + 1 ? "active" : ""}"><i>${step > i + 1 ? "✓" : i + 1}</i><span>${x}</span></div>`).join("");
  const s = SERVICES.find((x) => x.id === service);
  $("s-name").textContent = s.name; $("s-fee").textContent = fmt(s.fee); $("s-total").textContent = fmt(s.fee);
  $("back").disabled = step === 1;
  $("next").textContent = step === 4 ? "Tạo vận đơn" : "Tiếp tục";
  $("confirm-text").textContent = `Gửi tới ${val("rname")} · ${val("raddr")} · ${s.name} · ${fmt(s.fee)}.`;
}
$("back").onclick = () => { step = Math.max(1, step - 1); $("err").hidden = true; render(); };
$("form").addEventListener("submit", (e) => {
  e.preventDefault();
  const msg = check();
  $("err").textContent = msg; $("err").hidden = !msg;
  if (msg) return;
  if (step < 4) { step++; return render(); }
  const list = JSON.parse(localStorage.getItem("pp-shipments") || "[]");
  const code = "PPVN-" + String(1000 + list.length * 7 + 2025).padStart(4, "0") + "-" + (3000 + list.length);
  list.unshift({ code, name: val("rname"), address: val("raddr"), service, weight: $("pweight").value });
  localStorage.setItem("pp-shipments", JSON.stringify(list));
  notify("Tạo đơn thành công", `Mã vận đơn ${code} đã được tạo.`);
  $("next").disabled = true;
  setTimeout(() => (location.href = "dashboard.html"), 1200);
});
renderServices(); render();
