/* dispatcher-operations-dashboard.js - biểu đồ cột theo kỳ/ngày và bảng ngoại lệ (bấm dòng để sang hàng đợi). */
initShell({ role: "dispatcher", page: "dispatcher/operations-dashboard", title: "Trung tâm vận hành", subtitle: "Tổng quan mạng lưới · Cập nhật lúc 13:48" });
const $ = (id) => document.getElementById(id);
const DATA = [74, 82, 67, 91, 86, 95, 79];
function renderChart() {
  const p = $("period").value;
  $("chart-sub").textContent = "Dữ liệu đến ngày " + $("date").value.split("-").reverse().join("/");
  $("bars").innerHTML = "";
  DATA.forEach((h, i) => {
    const d = document.createElement("div");
    d.innerHTML = `<i style="height:${h}%" title="${h}%"></i><b>${h}%</b><span>${p === "Năm" ? "T" + (i + 1) : ["T2", "T3", "T4", "T5", "T6", "T7", "CN"][i]}</span>`;
    $("bars").appendChild(d);
  });
}
$("period").onchange = renderChart; $("date").onchange = renderChart; renderChart();
EXC_CASES.forEach((c) => {
  const tr = document.createElement("tr"); tr.style.cursor = "pointer";
  tr.innerHTML = `<td></td><td></td><td></td><td></td><td></td><td><span class="badge badge-${c.level === "Cao" ? "red" : c.level === "Thấp" ? "gray" : "orange"}"></span></td><td><span class="bi bi-chevron-right"></span></td>`;
  [c.id, c.code, c.type, c.route, c.open].forEach((t, i) => (tr.children[i].textContent = t));
  tr.querySelector(".badge").textContent = c.level;
  tr.onclick = () => { sessionStorage.setItem("pp-case", c.id); location.href = "exception-queue.html"; };
  $("rows").appendChild(tr);
});
