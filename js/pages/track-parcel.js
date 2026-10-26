/* track-parcel.js - tra cứu đơn + AI giải thích ETA (mô phỏng, không gọi API thật). */
initShell({ role: "recipient", page: "recipient/track-parcel",
  title: "Theo dõi đơn hàng", subtitle: "Cập nhật hành trình theo thời gian thực" });

const SAMPLE = "PPVN-8246-1937";
const events = [   // dữ liệu giả lập; sau này chuyển sang assets/data/trackingEvents.json
  { text: "Đang trên đường giao đến bạn", place: "Q. Cầu Giấy, Hà Nội · 13:42", active: true, icon: "bi-truck" },
  { text: "Đã đến bưu cục giao hàng", place: "Kho Cầu Giấy · 09:18", icon: "bi-check-lg" },
  { text: "Đã rời kho phân loại", place: "Kho Sóc Sơn · 06:25", icon: "bi-check-lg" },
  { text: "Đã lấy hàng từ người gửi", place: "TP. Hải Phòng · Hôm qua, 16:04", icon: "bi-check-lg" },
];

// Hiển thị timeline (dùng textContent để tránh chèn HTML lạ)
const tl = document.getElementById("timeline");
events.forEach((ev) => {
  const row = document.createElement("div");
  if (ev.active) row.className = "active";
  row.innerHTML = `<i><span class="bi ${ev.icon}"></span></i><div><strong></strong><p></p></div>`;
  row.querySelector("strong").textContent = ev.text;
  row.querySelector("p").textContent = ev.place;
  tl.appendChild(row);
});

// Tra cứu: đang tải -> kết quả hoặc không tìm thấy
const $ = (id) => document.getElementById(id);
$("track-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const code = $("code").value.trim();
  if (!code) return notify("Thiếu mã vận đơn", "Vui lòng nhập mã để tra cứu.");
  $("result").hidden = true; $("not-found").hidden = true; $("loading").hidden = false;
  setTimeout(() => {
    $("loading").hidden = true;
    const ok = code.toUpperCase() === SAMPLE;
    $("result").hidden = !ok;
    $("not-found").hidden = ok;
  }, 700);
});
$("use-sample").onclick = () => { $("code").value = SAMPLE; $("track-form").requestSubmit(); };

// AI-2: 4 trạng thái idle / loading / done / error
let aiState = "idle";
function renderAI(msg) {
  const text = { idle: "AI phân tích giao thông, tuyến đường và số điểm dừng để giải thích thời gian giao.",
    loading: "Đang phân tích tuyến đường...",
    done: "Lưu lượng tại Cầu Giấy đang cao hơn 18%. Tài xế còn 3 điểm dừng, ETA có độ tin cậy 92%.",
    error: msg || "Không thể xử lý yêu cầu lúc này. Bạn có thể thử lại." }[aiState];
  const label = { idle: "Xem phân tích", loading: "Vui lòng chờ...", done: "Thu gọn", error: "Thử lại" }[aiState];
  $("ai-text").textContent = text;
  $("ai-btn").textContent = label;
  $("ai-btn").disabled = aiState === "loading";
}
$("ai-btn").onclick = () => {
  if (aiState === "done") { aiState = "idle"; return renderAI(); }
  aiState = "loading"; renderAI();
  setTimeout(() => {
    aiState = Math.random() < 0.25 ? "error" : "done";   // 25% mô phỏng AI thất bại
    renderAI();
  }, 900);
};
renderAI();
