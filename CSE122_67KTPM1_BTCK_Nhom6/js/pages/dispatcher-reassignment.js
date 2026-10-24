/* dispatcher-reassignment.js - chọn tài xế mới cho case đã chọn ở Hàng đợi ngoại lệ, xác nhận (lưu LocalStorage). */
initShell({ role: "dispatcher", page: "dispatcher/reassignment", title: "Điều phối lại", subtitle: "Phân công tài xế phù hợp cho đơn" });
const $ = (id) => document.getElementById(id);
const c = EXC_CASES.find((x) => x.id === sessionStorage.getItem("pp-case")) || EXC_CASES[0];
document.querySelector("header p").textContent = "Phân công tài xế phù hợp cho đơn " + c.code;
let sel = 0;
function render() {
  $("drivers").innerHTML = "";
  DRIVERS.forEach((d, i) => {
    const b = document.createElement("button"); b.className = i === sel ? "selected" : "";
    b.innerHTML = `<div class="avatar driver"></div><div><h4></h4><p><span>Khoảng cách <b></b></span><span>Tải hiện tại <b></b></span><span>Đúng hẹn <b></b></span></p></div><i class="radio"></i>`;
    b.querySelector(".avatar").textContent = d.name.split(" ").slice(-2).map((x) => x[0]).join("");
    b.querySelector("h4").textContent = d.name + " ";
    if (i === 0) b.querySelector("h4").insertAdjacentHTML("beforeend", '<span class="badge badge-purple">AI ĐỀ XUẤT</span>');
    [d.dist, d.load, d.ontime].forEach((t, k) => (b.querySelectorAll("b")[k].textContent = t));
    b.onclick = () => { sel = i; render(); }; $("drivers").appendChild(b);
  });
  $("s-code").textContent = c.code; $("s-driver").textContent = DRIVERS[sel].name;
}
$("confirm").onclick = () => {
  const list = JSON.parse(localStorage.getItem("pp-reassign") || "[]");
  list.push({ case: c.id, code: c.code, driver: DRIVERS[sel].name });
  localStorage.setItem("pp-reassign", JSON.stringify(list));
  notify("Điều phối thành công", `Đã giao đơn cho ${DRIVERS[sel].name}.`);
  $("confirm").disabled = true; setTimeout(() => (location.href = "exception-queue.html"), 1200);
};
render();
