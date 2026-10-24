/* support.js - form gửi sự cố có kiểm tra hợp lệ, lưu danh sách yêu cầu vào LocalStorage. */
initShell({ role: "recipient", page: "recipient/support", title: "Phản hồi sự cố", subtitle: "Gửi yêu cầu hỗ trợ đến trung tâm điều phối" });
const $ = (id) => document.getElementById(id);
let tickets = [];
try { tickets = JSON.parse(localStorage.getItem("pp-tickets")) || []; } catch {}
if (!tickets.length) tickets = [{ id: "SP-0941", title: "Sai địa chỉ", status: "Đã giải quyết · 12/05/2025", open: false }];

ORDERS.forEach((o) => $("order").add(new Option(`${o.code} · ${o.status}`)));
function renderHistory() {
  $("history").innerHTML = "";
  $("empty").hidden = tickets.length > 0;
  tickets.forEach((t) => {
    const d = document.createElement("div");
    if (t.open) d.className = "active";
    d.innerHTML = `<i><span class="bi ${t.open ? "bi-clock" : "bi-check-lg"}"></span></i><div><strong></strong><p></p></div>`;
    d.querySelector("strong").textContent = `${t.id} · ${t.title}`;
    d.querySelector("p").textContent = t.status;
    $("history").appendChild(d);
  });
}
$("form").addEventListener("submit", (e) => {
  e.preventDefault();
  const detail = $("detail").value.trim();
  if (detail.length < 10) { $("err").textContent = "Vui lòng mô tả ít nhất 10 ký tự."; $("err").hidden = false; return; }
  $("err").hidden = true;
  const id = "SP-" + (1085 + tickets.length);
  tickets.unshift({ id, title: $("issue").value, status: "Đang chờ điều phối viên · vừa xong", open: true });
  localStorage.setItem("pp-tickets", JSON.stringify(tickets));
  $("code").textContent = `Mã yêu cầu ${id}. Điều phối viên sẽ tiếp nhận và phản hồi qua ứng dụng.`;
  $("form").hidden = true; $("done").hidden = false; renderHistory();
});
$("again").onclick = () => { $("form").reset(); $("form").hidden = false; $("done").hidden = true; };
renderHistory();
