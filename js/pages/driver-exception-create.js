/* driver-exception-create.js - báo cáo ngoại lệ + AI-1 phân loại (luật từ khoá). AI có đủ: xử lý, kết quả, lý do, thất bại, thử lại. */
initShell({ role: "driver", page: "driver/exception-create", title: "Báo cáo ngoại lệ", subtitle: "Đơn PPVN-8246-1937 · Điểm dừng 04" });
const $ = (id) => document.getElementById(id);
const RULES = [   // [loại, từ khoá, độ tin cậy]
  ["Khách hàng vắng mặt", ["vắng", "không nghe", "không có nhà", "không liên lạc"], 94],
  ["Sai địa chỉ", ["sai địa chỉ", "không tìm thấy", "không tồn tại"], 90],
  ["Khách từ chối nhận", ["từ chối", "không nhận", "hủy đơn", "huỷ đơn"], 88],
  ["Hàng hư hỏng", ["móp", "hỏng", "vỡ", "ướt", "rách"], 91],
];
let lastRegen = 0;
function validate() { $("submit").disabled = !$("type").value; }
$("note").addEventListener("input", () => { $("count").textContent = $("note").value.length + "/300 ký tự"; });
$("type").addEventListener("change", validate);

function showAI(state, data) {
  const box = $("ai");
  if (state === "idle") box.innerHTML = `<p>AI đọc mô tả và đề xuất loại ngoại lệ phù hợp, giúp giảm thời gian xử lý.</p><button class="ai-button" id="run">Phân tích mô tả <span class="bi bi-arrow-right"></span></button>`;
  if (state === "loading") box.innerHTML = `<div class="ai-loading"><i></i><i></i><i></i><p>Đang phân tích tình huống...</p></div>`;
  if (state === "done") box.innerHTML = `<div class="ai-result"><span class="badge badge-purple">ĐỘ TIN CẬY ${data.conf}%</span><span>Đề xuất phân loại</span><h3></h3>
      <p><strong>Lý do:</strong> Ghi chú có từ khoá “<span id="kw"></span>”.</p><div><button id="ok">Chấp nhận</button><button id="no">Từ chối</button><button id="re">Tạo lại</button></div></div>`;
  if (state === "error") box.innerHTML = `<div class="ai-result"><span class="badge badge-orange">AI CHƯA CHẮC CHẮN</span><p>${data}</p><div><button id="re">Thử lại</button><button id="manual">Chọn thủ công</button></div></div>`;
  if (state === "done") { box.querySelector("h3").textContent = data.type; box.querySelector("#kw").textContent = data.kw; }
  box.querySelector("#run")?.addEventListener("click", analyze);
  box.querySelector("#re")?.addEventListener("click", analyze);
  box.querySelector("#no")?.addEventListener("click", () => showAI("idle"));
  box.querySelector("#manual")?.addEventListener("click", () => $("type").focus());
  box.querySelector("#ok")?.addEventListener("click", () => { $("type").value = data.type; validate(); notify("Đã chấp nhận", "Phân loại AI đã được áp dụng."); });
}
function analyze() {
  const text = $("note").value.trim().toLowerCase();
  if (text.length < 10) return notify("Chưa đủ thông tin", "Hãy nhập mô tả ít nhất 10 ký tự.");   // kiểm tra hợp lệ
  showAI("loading");
  setTimeout(() => {
    for (const [type, words, conf] of RULES) {
      const kw = words.find((w) => text.includes(w));
      if (kw) return showAI("done", { type, kw, conf });
    }
    showAI("error", "Không đủ dữ liệu để đưa ra đề xuất. Hãy mô tả rõ hơn hoặc chọn loại thủ công.");
  }, 900);
}
$("draft").onclick = () => { localStorage.setItem("pp-exc-draft", $("note").value); notify("Đã lưu nháp", "Bản nháp được lưu trên thiết bị này."); };
$("note").value = localStorage.getItem("pp-exc-draft") || "";
$("form").addEventListener("submit", (e) => {
  e.preventDefault();
  if ($("note").value.trim().length < 10) return notify("Thiếu mô tả", "Hãy nhập mô tả ít nhất 10 ký tự.");
  const list = JSON.parse(localStorage.getItem("pp-exceptions") || "[]");
  list.push({ order: "PPVN-8246-1937", type: $("type").value, note: $("note").value.trim(), status: "Chờ điều phối" });
  localStorage.setItem("pp-exceptions", JSON.stringify(list)); localStorage.removeItem("pp-exc-draft");
  notify("Đã gửi ngoại lệ", "Điều phối viên sẽ phản hồi trong ít phút.");
  $("form").reset(); $("count").textContent = "0/300 ký tự"; validate(); showAI("idle");
});
showAI("idle"); validate();
