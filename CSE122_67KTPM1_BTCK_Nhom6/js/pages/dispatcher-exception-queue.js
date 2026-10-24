/* dispatcher-exception-queue.js - danh sách case, chi tiết, AI-3 "Next Best Action" (đang xử lý / kết quả / lỗi / thử lại). */
initShell({ role: "dispatcher", page: "dispatcher/exception-queue", title: "Hàng đợi ngoại lệ", subtitle: "23 trường hợp đang mở · 7 cần ưu tiên" });
const $ = (id) => document.getElementById(id);
let sel = Math.max(0, EXC_CASES.findIndex((c) => c.id === sessionStorage.getItem("pp-case")));
let ai = "idle";                                  // idle | loading | done | error
const tone = (l) => (l === "Cao" ? "red" : l === "Thấp" ? "gray" : "orange");
function renderList() {
  const q = $("q").value.toLowerCase();
  $("cases").innerHTML = "";
  EXC_CASES.forEach((c, i) => {
    if (!(c.id + c.code + c.type).toLowerCase().includes(q)) return;
    const b = document.createElement("button"); b.className = i === sel ? "active" : "";
    b.innerHTML = `<div><span class="badge badge-${tone(c.level)}"></span><span></span></div><h3></h3><p></p><small>Tuyến ${c.route} · Nguyễn Văn Hùng</small>`;
    b.querySelector(".badge").textContent = c.level === "Cao" ? "ƯU TIÊN CAO" : c.level.toUpperCase(); b.children[0].children[1].textContent = c.open;
    b.querySelector("h3").textContent = c.type; b.querySelector("p").textContent = `${c.id} · ${c.code}`;
    b.onclick = () => { sel = i; ai = "idle"; render(); }; $("cases").appendChild(b);
  });
  if (!$("cases").children.length) $("cases").innerHTML = '<div class="empty-inline">Không có case phù hợp.</div>';
}
function aiBox(c) {
  if (ai === "idle") return `<button class="ai-button" id="run">Phân tích đề xuất <span class="bi bi-arrow-right"></span></button>`;
  if (ai === "loading") return `<div class="ai-loading"><i></i><i></i><i></i><p>Đang phân tích...</p></div>`;
  if (ai === "error") return `<p>Không đủ dữ liệu để đưa ra đề xuất lúc này.</p><div><button id="run">Thử lại</button><button id="manual">Xử lý thủ công</button></div>`;
  return `<h4></h4><p></p><div><button id="ok">Chấp nhận đề xuất</button><button id="skip">Bỏ qua</button><button id="run">Tạo lại</button></div>`;
}
function renderDetail() {
  const c = EXC_CASES[sel];
  $("detail").innerHTML = `<div class="panel-title"><div><span class="badge badge-${tone(c.level)}"></span><h2></h2><p></p></div></div>
    <div class="case-meta"><div><span>Tài xế</span><strong>Nguyễn Văn Hùng</strong></div><div><span>Thời gian mở</span><strong></strong></div><div><span>SLA phản hồi</span><strong class="orange">Còn 18 phút</strong></div></div>
    <div class="problem-detail"><span class="bi bi-exclamation-triangle"></span><div><strong>Đã gặp vấn đề gì?</strong><p></p></div></div>
    <div class="ai-suggestion"><div class="ai-head"><div class="ai-icon"><span class="bi bi-stars"></span></div><div><small id="conf"></small><h3>Đề xuất xử lý tiếp theo</h3></div></div><div id="aibox">${aiBox(c)}</div></div>
    <div class="form-actions"><button class="secondary" id="contact">Liên hệ khách hàng</button><button class="primary" id="re">Điều phối lại <span class="bi bi-arrow-right"></span></button></div>`;
  const d = $("detail");
  d.querySelector(".badge").textContent = c.level.toUpperCase(); d.querySelector("h2").textContent = c.type; d.querySelector("p").textContent = `${c.id} · ${c.code}`;
  d.querySelectorAll(".case-meta strong")[1].textContent = c.open; d.querySelector(".problem-detail p").textContent = c.detail;
  $("conf").textContent = ai === "done" ? `NEXT BEST ACTION · ${c.conf}% TIN CẬY` : "NEXT BEST ACTION";
  if (ai === "done") { d.querySelector("#aibox h4").textContent = c.action; d.querySelector("#aibox p").textContent = c.why; }
  $("run")?.addEventListener("click", run);
  $("ok")?.addEventListener("click", () => notify("Đã áp dụng đề xuất", "Khách hàng sẽ nhận được yêu cầu xác nhận."));
  $("skip")?.addEventListener("click", () => { ai = "idle"; renderDetail(); notify("Đã bỏ qua", "Bạn có thể xử lý thủ công."); });
  $("manual")?.addEventListener("click", () => { ai = "idle"; renderDetail(); });
  $("contact").onclick = () => notify("Đang liên hệ", "Đã gọi cho người nhận của " + c.code);
  $("re").onclick = () => { sessionStorage.setItem("pp-case", c.id); location.href = "reassignment.html"; };
}
function run() { ai = "loading"; renderDetail(); setTimeout(() => { ai = Math.random() < 0.2 ? "error" : "done"; renderDetail(); }, 900); }
function render() { renderList(); renderDetail(); }
$("q").addEventListener("input", renderList);
render();
