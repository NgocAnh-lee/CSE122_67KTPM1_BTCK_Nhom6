/* driver-stop-detail.js - xác nhận đã giao (bắt buộc nhập tên người nhận). */
initShell({ role: "driver", page: "driver/stop-detail", title: "Chi tiết điểm dừng", subtitle: "Điểm 04 / 14 · Mã đơn PPVN-8246-1937" });
const $ = (id) => document.getElementById(id);
$("form").addEventListener("submit", (e) => {
  e.preventDefault();
  const name = $("receiver").value.trim();
  if (name.length < 2) { $("err").textContent = "Vui lòng nhập tên người đã nhận hàng."; $("err").hidden = false; return; }
  $("err").hidden = true;
  setDone([...new Set([...getDone(), 3])]);          // đánh dấu đơn số 4 hoàn thành
  $("confirm").disabled = true; $("confirm").textContent = "Đã hoàn thành";
  notify("Giao hàng thành công", `Đã bàn giao cho ${name}.`);
});
