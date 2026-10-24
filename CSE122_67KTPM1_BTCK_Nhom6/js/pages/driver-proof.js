/* driver-proof.js - chọn đơn đã hoàn thành, thêm/xoá tối đa 4 ảnh (kiểm tra loại + dung lượng), gửi duyệt. */
initShell({ role: "driver", page: "driver/proof", title: "Minh chứng giao hàng", subtitle: "Ảnh được gửi đến quản trị viên để kiểm tra" });
const $ = (id) => document.getElementById(id);
const photos = [];                       // tên file đã chọn
const doneOrders = STOPS.slice(0, 4).filter((_, i) => getDone().includes(i));
doneOrders.forEach((o) => $("order").add(new Option(`${o.code} · ${o.name}`)));
$("none").hidden = doneOrders.length > 0;
function render() {
  $("photos").innerHTML = "";
  photos.forEach((n, i) => {
    const d = document.createElement("div");
    d.innerHTML = `<span class="bi bi-image fs-3"></span><button aria-label="Xoá ảnh">×</button><span></span>`;
    d.lastChild.textContent = n;
    d.querySelector("button").onclick = () => { photos.splice(i, 1); render(); };
    $("photos").appendChild(d);
  });
  $("send").disabled = !photos.length || !doneOrders.length;
  $("send").textContent = `Gửi quản trị viên duyệt (${photos.length} ảnh)`;
}
$("add").onclick = () => photos.length < 4 ? $("file").click() : notify("Đã đủ 4 ảnh", "Hãy xoá bớt ảnh nếu muốn thay.");
$("file").onchange = (e) => {
  const f = e.target.files[0]; e.target.value = "";
  if (!f) return;
  if (!/^image\/(png|jpeg)$/.test(f.type)) return notify("Sai định dạng", "Chỉ nhận ảnh JPG hoặc PNG.");
  if (f.size > 5 * 1024 * 1024) return notify("Ảnh quá lớn", "Mỗi ảnh tối đa 5MB.");
  photos.push(f.name); render();
};
$("send").onclick = () => {
  const list = JSON.parse(localStorage.getItem("pp-proofs") || "[]");
  list.push({ order: $("order").value, photos: photos.length, note: $("note").value.trim(), status: "Chờ duyệt" });
  localStorage.setItem("pp-proofs", JSON.stringify(list));
  $("done-text").textContent = `Minh chứng của đơn ${$("order").value.split(" ")[0]} đang ở trạng thái chờ duyệt.`;
  $("form-wrap").hidden = true; $("done").hidden = false;
};
$("again").onclick = () => { photos.length = 0; $("note").value = ""; $("form-wrap").hidden = false; $("done").hidden = true; render(); };
render();
