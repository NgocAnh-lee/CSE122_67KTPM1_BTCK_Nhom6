/* workspace.js - trang dạng "KPI + danh sách + modal chi tiết". Chọn dữ liệu bằng <body data-kind="...">. */
const D = document.body.dataset;
initShell({ role: D.role, page: D.page, title: D.title, subtitle: D.subtitle });
const CONFIGS = {
  addresses: { icon: "bi-geo-alt", stats: ["248 khách hàng", "248 địa chỉ", "32 khách mới tháng này"], items: [
    ["Nguyễn Hải Anh", "88 Trần Thái Tông, Cầu Giấy", "0123456789 · 12 đơn"], ["Lê Minh Long", "12 Nguyễn Trãi, Thanh Xuân", "0123456789 · 8 đơn"],
    ["Trần Thu Mai", "41 Huế, Hai Bà Trưng", "0123456789 · 6 đơn"], ["Phạm Minh Phương", "18 Trần Thái Tông, Cầu Giấy", "0123456789 · 4 đơn"],
    ["Vũ Hoàng Nam", "139 Cầu Giấy, Cầu Giấy", "0123456789 · 3 đơn"]] },
  returns: { icon: "bi-box-seam", stats: ["3 đang hoàn", "8 đã nhận lại", "2 cần xử lý"], items: [
    ["PPVN-7153-9021", "Khách từ chối nhận", "Đang về kho Cầu Giấy"], ["PPVN-6120-8871", "Sai địa chỉ nhiều lần", "Chờ xác nhận hoàn"],
    ["PPVN-5198-2234", "Hàng hư hỏng", "Đã hoàn về người gửi"]] },
  monitor: { icon: "bi-truck", stats: ["86 tài xế online", "72 đang giao", "6 đang nghỉ"], items: [
    ["Nguyễn Văn Hùng", "Tuyến CG-04 · 8/14 điểm", "Hoạt động"], ["Trần Minh Đức", "Tuyến CG-07 · 4/12 điểm", "Hoạt động"],
    ["Lê Quốc Anh", "Tuyến BD-11 · 7/14 điểm", "Tạm nghỉ"]] },
  feedback: { icon: "bi-box-seam", stats: ["18 phản hồi mới", "7 đang xử lý", "94% đúng SLA"], items: [
    ["SP-1084 · Tài xế chưa đến", "Phạm Minh Phương · PPVN-8246-1937", "Ưu tiên cao"], ["SP-1081 · Muốn đổi lịch giao", "Lê Hải Anh · PPVN-7153-9021", "Đang xử lý"],
    ["SP-1079 · Hàng móp góc", "Vũ Hoàng Nam · PPVN-6330-1842", "Chờ bằng chứng"]] },
  audit: { icon: "bi-clock", stats: ["1.284 sự kiện", "42 người dùng", "0 cảnh báo bảo mật"], items: [
    ["Cập nhật trạng thái đơn", "Nguyễn Văn Hùng · PPVN-8246-1937", "13:42:18"], ["Điều phối lại tài xế", "Trần Thu Trang · EX-2048", "13:38:02"],
    ["Duyệt minh chứng giao hàng", "Phạm Quốc Bảo · PPVN-8041-2836", "13:22:41"]] },
  settings: { icon: "bi-box-seam", stats: ["Hệ thống ổn định", "12 tích hợp", "99.98% uptime"], items: [
    ["Thông báo giao hàng", "Email, SMS, Push", "Đang bật"], ["Quy tắc SLA ngoại lệ", "Phản hồi trong 30 phút", "Đang bật"],
    ["Đồng bộ dữ liệu", "Mỗi 5 phút", "Đang bật"]] },
  history: { icon: "bi-box-seam", stats: ["14 ca tháng này", "186 đơn đã giao", "97.2% thành công"], items: [
    ["Ca 19/05/2025", "14 điểm · 18 đơn", "Đang hoạt động"], ["Ca 18/05/2025", "16 điểm · 21 đơn", "Hoàn thành"],
    ["Ca 17/05/2025", "12 điểm · 15 đơn", "Hoàn thành"]] },
  overview: { icon: "bi-box-seam", stats: ["28.492 đơn", "92 người dùng", "99.98% uptime"], items: [
    ["Dịch vụ API", "Phản hồi trung bình 142ms", "Bình thường"], ["Hệ thống thông báo", "12.480 thông báo hôm nay", "Bình thường"],
    ["Kho dữ liệu", "Sao lưu lúc 03:00", "Bình thường"]] },
};
const c = CONFIGS[D.kind];
const LABELS = ["Tổng quan", "Đang hoạt động", "Chỉ số chất lượng"], TONES = ["blue", "green", "gray"];
const $ = (id) => document.getElementById(id);

c.stats.forEach((x, i) => {
  const d = document.createElement("div");
  d.innerHTML = `<span></span><strong class="${i === 2 ? "metric-text" : ""}"></strong>`;
  d.children[0].textContent = LABELS[i]; d.children[1].textContent = x;
  $("kpis").appendChild(d);
});
c.items.forEach((x, i) => {
  const row = document.createElement("div");
  row.innerHTML = `<i><span class="bi ${c.icon}"></span></i><div><strong></strong><p></p></div>
    <span class="badge badge-${TONES[i] || "gray"}"></span><button class="icon-button"><span class="bi bi-three-dots"></span></button>`;
  row.querySelector("strong").textContent = x[0]; row.querySelector("p").textContent = x[1];
  row.querySelector(".badge").textContent = x[2];
  row.querySelector("button").setAttribute("aria-label", "Xem " + x[0]);
  row.querySelector("button").onclick = () => {
    const m = openModal(`<div class="panel-title"><div><span class="badge badge-blue">CHI TIẾT</span><h2></h2><p></p></div>
      <button class="icon-button" id="x" aria-label="Đóng">×</button></div>
      <div class="info-row"><span class="bi ${c.icon}"></span><div><span>Thông tin</span><strong id="info"></strong></div></div>
      <div class="driver-note"><strong>Trạng thái hiện tại</strong><p id="st"></p></div>
      <div class="form-actions"><button class="primary" id="ok">Đã hiểu</button></div>`);
    m.querySelector("h2").textContent = x[0]; m.querySelector("p").textContent = D.title;
    m.querySelector("#info").textContent = x[1];
    m.querySelector("#st").textContent = x[2] + ". Dữ liệu đã được đồng bộ và lưu trong nhật ký hệ thống.";
    m.querySelector("#x").onclick = m.querySelector("#ok").onclick = closeModal;
  };
  $("list").appendChild(row);
});
$("add").onclick = () => notify("Thao tác mới", "Biểu mẫu đã được mở.");
