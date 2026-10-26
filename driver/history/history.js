// tạo biến lữu trữ lịch sử làm bài
const historyData = {
  stats: [
    ["Tổng quan", "14 ca tháng này", "3 ca gần nhất"],
    ["Đang hoạt động", "186 đơn đã giao", "97.2% thành công"],
    ["Chỉ số chất lượng", "4.8/5", "92% đúng giờ"]
  ],
  items: [
    ["Ca 19/05/2025", "14 điểm · 18 đơn", "Đang hoạt động"],
    ["Ca 18/05/2025", "16 điểm · 21 đơn", "Hoàn thành"],
    ["Ca 17/05/2025", "12 điểm · 15 đơn", "Hoàn thành"]
  ]
};

const kpis = document.getElementById('kpis');
const list = document.getElementById('list');
const modal = document.getElementById('historyModal');
const modalTitle = document.getElementById('modalTitle');
const modalSubtitle = document.getElementById('modalSubtitle');
const modalInfo = document.getElementById('modalInfo');
const modalStatus = document.getElementById('modalStatus');

const LABELS = ['Tổng quan', 'Đang hoạt động', 'Chỉ số chất lượng'];
const TONES = ['blue', 'green', 'gray'];
// hiển thị các thẻ thống kê
function renderKpis() {
  historyData.stats.forEach((entry, index) => {
    const card = document.createElement('div');
    card.innerHTML = `
      <span>${LABELS[index]}</span>
      <strong class="${index === 2 ? 'metric-text' : ''}">${entry[1]}</strong>
      <p>${entry[2]}</p>
    `;
    kpis.appendChild(card);
  });
}
// hàm để mở hộp thoại
function openModal(item) {
  modalTitle.textContent = item[0];
  modalSubtitle.textContent = 'Lịch sử ca làm việc';
  modalInfo.textContent = item[1];
  modalStatus.textContent = `${item[2]}. Dữ liệu đã được đồng bộ và lưu trong nhật ký hệ thống.`;
  modal.classList.remove('hidden');
  modal.setAttribute('aria-hidden', 'false');
}

function closeModal() {
  modal.classList.add('hidden');
  modal.setAttribute('aria-hidden', 'true');
}

function renderList() {
  historyData.items.forEach((item, index) => {
    const row = document.createElement('div');
    row.innerHTML = `
      <i><span class="bi bi-clock-history"></span></i>
      <div>
        <strong>${item[0]}</strong>
        <p>${item[1]}</p>
      </div>
      <span class="badge badge-${TONES[index % TONES.length]}">${item[2]}</span>
      <button class="icon-button" type="button" aria-label="Xem ${item[0]}">
        <span class="bi bi-three-dots"></span>
      </button>
    `;

    const actionButton = row.querySelector('button');
    actionButton.addEventListener('click', () => openModal(item));

    list.appendChild(row);
  });
}
// gắn sự kiện cho nút thêm mới
document.getElementById('add').addEventListener('click', () => {
  const item = ['Ca mới', 'Đang tạo dữ liệu ca làm việc', 'Chưa lưu'];
  openModal(item);
});

document.querySelector('.close-btn').addEventListener('click', closeModal);
document.getElementById('modalOk').addEventListener('click', closeModal);
modal.addEventListener('click', (event) => {
  if (event.target === modal) closeModal();
});

renderKpis();
renderList();