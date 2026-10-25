const fileInput = document.getElementById("proofInput");
const photoBoxes = document.querySelectorAll(".photo-grid > div");

if (fileInput) {
  fileInput.addEventListener("change", function () {
    const files = Array.from(this.files);

    if (!files.length) return;

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