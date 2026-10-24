/* dispatcher-assignment.js - lọc theo khu vực, chọn đơn + tài xế, xác nhận phân công (lưu LocalStorage). */
initShell({ role: "dispatcher", page: "dispatcher/assignment", title: "Phân công đơn hàng theo khu vực", subtitle: "Chọn chính xác đơn hàng và tài xế phụ trách đúng khu vực" });
const $ = (id) => document.getElementById(id);
const REGIONS = ["Cầu Giấy", "Ba Đình", "Nam Từ Liêm"];
const ORDERS_TODO = [["PPVN-9021-1137", "Hoàn Kiếm → {r}", "2.4 kg", "Trước 16:00"], ["PPVN-9021-1140", "Ba Đình → {r}", "1.2 kg", "Trước 17:30"], ["PPVN-9021-1148", "Đống Đa → {r}", "4.8 kg", "Trước 18:00"]];
const DRV = [["Nguyễn Văn Hùng", "CG-04", "8/14 đơn", "1.3 km"], ["Trần Minh Đức", "CG-07", "4/12 đơn", "2.1 km"], ["Lê Quốc Anh", "CG-11", "7/14 đơn", "3.8 km"]];
let region = REGIONS[0], o = 0, d = 0;
let assigned = JSON.parse(localStorage.getItem("pp-assigned") || "[]");
function pick(list, idx, onPick, build) {
  list.innerHTML = "";
  idx.forEach((_, i) => {
    const b = document.createElement("button");
    b.className = "selectable " + (list.id === "orders" ? "assign-order" : "assign-driver") + (onPick.cur() === i ? " selected" : "");
    build(b, i); b.onclick = () => { onPick.set(i); render(); }; list.appendChild(b);
  });
}
function render() {
  $("regions").innerHTML = "";
  REGIONS.forEach((r) => {
    const b = document.createElement("button"); b.textContent = r; b.className = r === region ? "active" : "";
    b.onclick = () => { region = r; o = 0; d = 0; render(); }; $("regions").appendChild(b);
  });
  $("h-orders").textContent = "Chọn đơn giao tại " + region; $("h-drivers").textContent = "Chọn tài xế phụ trách " + region;
  $("n-orders").textContent = ORDERS_TODO.length + " ĐƠN";
  pick($("orders"), ORDERS_TODO, { cur: () => o, set: (i) => (o = i) }, (b, i) => {
    b.innerHTML = `<i class="radio"></i><div><strong></strong><p></p><span></span></div>`;
    b.querySelector("strong").textContent = ORDERS_TODO[i][0]; b.querySelector("p").textContent = ORDERS_TODO[i][1].replace("{r}", region);
    b.querySelector("span").textContent = ORDERS_TODO[i][2] + " · " + ORDERS_TODO[i][3];
  });
  pick($("drivers"), DRV, { cur: () => d, set: (i) => (d = i) }, (b, i) => {
    b.innerHTML = `<div class="avatar driver"></div><div><strong></strong><p></p></div><i class="radio"></i>`;
    b.querySelector(".avatar").textContent = DRV[i][0].split(" ").slice(-2).map((x) => x[0]).join("");
    b.querySelector("strong").textContent = DRV[i][0]; b.querySelector("p").textContent = `Khu vực ${region} · Tuyến ${DRV[i][1]} · ${DRV[i][2]} · cách ${DRV[i][3]}`;
  });
  const code = ORDERS_TODO[o][0], done = assigned.includes(code);
  $("pair").textContent = `${code} → ${DRV[d][0]}`;
  $("confirm").disabled = done; $("confirm").textContent = done ? "Đã phân công" : "Xác nhận phân công";
}
$("confirm").onclick = () => {
  const code = ORDERS_TODO[o][0]; assigned.push(code); localStorage.setItem("pp-assigned", JSON.stringify(assigned));
  notify("Phân công thành công", `${code} đã giao cho ${DRV[d][0]} tại ${region}.`); render();
};
render();
