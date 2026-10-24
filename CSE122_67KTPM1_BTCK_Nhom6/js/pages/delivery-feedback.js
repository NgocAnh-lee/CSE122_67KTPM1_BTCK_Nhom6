/* delivery-feedback.js - chọn sao, chọn nhãn, gửi và chỉnh sửa đánh giá (lưu LocalStorage). */
initShell({ role: "recipient", page: "recipient/delivery-feedback", title: "Đánh giá giao hàng", subtitle: "Ý kiến của bạn giúp chúng tôi tốt hơn mỗi ngày" });
const $ = (id) => document.getElementById(id);
const TAGS = ["Giao hàng nhanh", "Tài xế thân thiện", "Hàng nguyên vẹn", "Đúng giờ"];
let fb = { rating: 0, tags: [], comment: "" };
try { fb = { ...fb, ...JSON.parse(localStorage.getItem("pp-feedback")) }; } catch {}

function renderStars() {
  $("stars").innerHTML = "";
  for (let x = 1; x <= 5; x++) {
    const b = document.createElement("button");
    b.className = fb.rating >= x ? "on" : "";
    b.setAttribute("aria-label", `${x} sao`);
    b.innerHTML = `<span class="bi bi-star-fill" style="font-size:32px"></span>`;
    b.onclick = () => { fb.rating = x; renderStars(); };
    $("stars").appendChild(b);
  }
  $("send").disabled = !fb.rating;
}
function renderChips() {
  $("chips").innerHTML = "";
  TAGS.forEach((t) => {
    const b = document.createElement("button");
    b.textContent = t;
    if (fb.tags.includes(t)) b.style.cssText = "border-color:#2865e8;color:#2865e8;background:#eff4ff";
    b.onclick = () => { fb.tags = fb.tags.includes(t) ? fb.tags.filter((x) => x !== t) : [...fb.tags, t]; renderChips(); };
    $("chips").appendChild(b);
  });
}
$("comment").value = fb.comment;
$("send").onclick = () => {
  fb.comment = $("comment").value.trim();
  localStorage.setItem("pp-feedback", JSON.stringify(fb));
  $("form").hidden = true; $("done").hidden = false;
  notify("Đã gửi đánh giá", `${fb.rating}/5 sao`);
};
$("edit").onclick = () => { $("form").hidden = false; $("done").hidden = true; };
renderStars(); renderChips();
