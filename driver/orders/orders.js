const orders = [
  { id: "PPVN-8041-2836", name: "Nguyễn Thu Hà", address: "24 Duy Tân, Cầu Giấy", time: "08:30", status: "done" },
  { id: "PPVN-7153-9021", name: "Trần Quốc Minh", address: "88 Trần Thái Tông, Cầu Giấy", time: "09:15", status: "wait" },
  { id: "PPVN-6330-1842", name: "Lê Hải Anh", address: "12 Trung Kính, Cầu Giấy", time: "10:20", status: "going" },
  { id: "PPVN-8246-1937", name: "Phạm Minh Phương", address: "18 Trần Thái Tông, Cầu Giấy", time: "11:10", status: "wait" },
];

const statusLabels = {
  done: ["Hoàn thành", "st-done"],
  wait: ["Chờ giao", "st-wait"],
  going: ["Đang giao", "st-going"],
};
const picked = new Set(orders.filter((order) => order.status === "done").map((order) => order.id));
const projectRoot = "../CSE122_67KTPM1_BTCK_Nhom6/";
const orderList = document.getElementById("orderList");
document.getElementById("subtitle").textContent = `${orders.length} đơn trên tuyến CG-04`;

function renderOrders() {
  orderList.innerHTML = orders.map((order) => {
    const [label, statusClass] = statusLabels[order.status];
    const isPicked = picked.has(order.id);
    return `
      <article class="order-card ${order.status === "done" ? "done" : ""}" data-id="${order.id}">
        <button class="order-check ${isPicked ? "checked" : ""}" type="button" data-act="pick" aria-label="${isPicked ? "Bỏ đánh dấu" : "Đánh dấu"} ${order.id}" aria-pressed="${isPicked}">
          ${isPicked ? '<i class="bi bi-check-lg" aria-hidden="true"></i>' : ""}
        </button>
        <div class="order-info">
          <span class="status ${statusClass}">${label}</span>
          <h2>${order.name}</h2>
          <p>${order.id} · ${order.address} · ${order.time}</p>
        </div>
        <div class="order-actions">
          <a class="btn btn-outline-secondary" href="${projectRoot}pages/driver/stop-detail.html?id=${encodeURIComponent(order.id)}">Xem chi tiết</a>
          ${order.status === "done" ? `<a class="btn btn-primary" href="${projectRoot}pages/driver/proof.html?id=${encodeURIComponent(order.id)}">Gửi minh chứng</a>` : ""}
        </div>
      </article>`;
  }).join("");
}

orderList.addEventListener("click", (event) => {
  const button = event.target.closest('[data-act="pick"]');
  if (!button) return;

  const orderId = button.closest("[data-id]").dataset.id;
  if (picked.has(orderId)) picked.delete(orderId);
  else picked.add(orderId);
  renderOrders();
});

renderOrders();