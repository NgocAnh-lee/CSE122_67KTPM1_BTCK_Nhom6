/* admin-logistics-report.js - lọc ngày/kỳ, vẽ nhãn trục, xuất báo cáo CSV thật, thanh lý do ngoại lệ. */
initShell({ role: "admin", page: "admin/logistics-report", title: "Báo cáo logistics", subtitle: "Phân tích hiệu suất toàn mạng lưới" });
const $ = (id) => document.getElementById(id);
const REASONS = [["Khách vắng", 38], ["Sai địa chỉ", 24], ["Khách đổi lịch", 18], ["Hàng hư hỏng", 12], ["Khác", 8]];
const fmtDate = () => $("date").value.split("-").reverse().join("/");
function render() {
  const p = $("period").value;
  $("sub").textContent = "Số đơn tạo mới và giao thành công · đến " + fmtDate();
  const labels = p === "Theo năm" ? ["2021", "2022", "2023", "2024", "2025"] : p === "Theo tháng" ? ["T1", "T2", "T3", "T4", "T5"] : ["01/05", "05/05", "09/05", "13/05", "19/05"];
  $("axis").innerHTML = labels.map((l) => `<span>${l}</span>`).join("");
}
REASONS.forEach(([n, v]) => {
  const d = document.createElement("div");
  d.innerHTML = `<span></span><i><b style="width:${v}%"></b></i><strong>${v}%</strong>`; d.querySelector("span").textContent = n; $("reasons").appendChild(d);
});
$("export").onclick = () => {
  if (!$("date").value) return notify("Thiếu ngày", "Vui lòng chọn ngày thống kê.");
  const csv = "\ufeffChỉ số,Giá trị\nTổng đơn hàng,28492\nTỷ lệ giao thành công,96.8%\nThời gian giao TB (giờ),31\nChi phí / đơn (nghìn đồng),18.4\n\nLý do ngoại lệ,Tỷ lệ\n" + REASONS.map((r) => r.join(",") + "%").join("\n");
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
  a.download = "bao-cao-logistics-" + $("date").value + ".csv"; a.click(); URL.revokeObjectURL(a.href);
  notify("Đã xuất báo cáo", `Tệp CSV đến ngày ${fmtDate()} đã được tải xuống.`);
};
$("period").onchange = render; $("date").onchange = render;
render();
