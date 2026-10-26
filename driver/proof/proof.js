const fileInput = document.getElementById("proofInput"); // lấy ô chọn file ảnh trong html
const photoBoxes = document.querySelectorAll(".photo-grid > div");
// kiểm tra xem có ô chọn file k thì mới tiếp tục
if (fileInput) { 
  fileInput.addEventListener("change", function () {
    const files = Array.from(this.files);
// lấy danh sách các file được chọn và chuyển thành mảng
    if (!files.length) return;
// nếu kco thì dừng
    files.forEach((file, index) => {
      if (!photoBoxes[index]) return;

      photoBoxes[index].innerHTML = `
        <i class="bi bi-file-earmark-image fs-4"></i>
        <span>${file.name}</span>
        <button type="button" aria-label="Xóa ảnh">×</button>
      `;
    });
  });
}
// tìm nút, có thì nhấn để thực hiên, dấu ? tránh lỗi
document.querySelector(".btn-cancel")?.addEventListener("click", () => {
  if (fileInput) fileInput.value = "";
  photoBoxes.forEach((box) => {
    box.innerHTML = `
      <i class="bi bi-image fs-4"></i>
      <span>Ảnh</span>
      <button type="button" aria-label="Xóa ảnh">×</button>
    `;
  });
});