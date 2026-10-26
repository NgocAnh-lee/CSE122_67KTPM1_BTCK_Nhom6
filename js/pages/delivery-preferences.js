/* delivery-preferences.js - chọn khung giờ, ghi chú, giao nơi an toàn; lưu bằng LocalStorage. */
initShell({ role: "recipient", page: "recipient/delivery-preferences", title: "Tuỳ chọn giao hàng", subtitle: "Chủ động chọn cách bạn muốn nhận đơn" });
const $ = (id) => document.getElementById(id);
const SLOTS = ["08:00 – 11:00", "11:00 – 14:00", "14:00 – 17:00", "17:00 – 20:00"];
let prefs = { slot: SLOTS[2], note: "Gọi cho tôi trước 5 phút. Vui lòng để xe ở sảnh B.", safe: false };
try { prefs = { ...prefs, ...JSON.parse(localStorage.getItem("pp-prefs")) }; } catch {}

function renderSlots() {
  $("slots").innerHTML = "";
  SLOTS.forEach((s) => {
    const b = document.createElement("button");
    b.className = prefs.slot === s ? "selected" : "";
    b.innerHTML = `<span class="bi bi-clock"></span>`;
    b.append(s);
    b.onclick = () => { prefs.slot = s; renderSlots(); };
    $("slots").appendChild(b);
  });
}
$("note").value = prefs.note; $("safe").checked = prefs.safe;
const updateCount = () => ($("count").textContent = `${$("note").value.length}/160 ký tự`);
$("note").addEventListener("input", updateCount); updateCount();
$("save").onclick = () => {
  prefs.note = $("note").value.trim(); prefs.safe = $("safe").checked;
  if (/\b\d{9,}\b/.test(prefs.note)) return notify("Không lưu được", "Ghi chú không nên chứa dữ liệu nhạy cảm (dãy số dài).");
  localStorage.setItem("pp-prefs", JSON.stringify(prefs));
  notify("Đã lưu tuỳ chọn", `Khung giờ ưu tiên: ${prefs.slot}`);
};
renderSlots();
