//dataset: lay ac thuoc tinh bat dau bang data- trong HTML
const D = document.body.dataset;

initShell({
    //role: D.role lay gia tri cua D.role de truyen vao role
    role: D.role,
    page: D.page,
    title: D.title,
    subtitle: D.subtitle,
});

//BILLING de kiem tra xem rang co phai trang doi soat - trang hien thi phi van chuyen hay khong
const BILLING = D.mode === 'billing';

//filter de ghi nho xem nguoi dung dang chon loc theo trang thai nao
let filter = "Tất cả";

const $ = (id) => document.getElementById(id);

function render() {
    //toLowerCase=> chuyen chu thanh chu thuong
    const q = $("q").value.toLowerCase();

    //ORDERS bien chua dsach don hang, filter de loc
    const list = ORDERS.filter((o) =>
        (filter === "Tất cả" || o.status === filter) &&
        //tim kiem thong tin, includes kiem tra xem co chua tu khoa q hay khong
        (o.code + o.name + o.address).toLowerCase().includes(q)
    );

    $("rows").innerHTML = "";

    //list dsach don hang sau khi loc, o :doan hang hien tai, i: vi tri cua don hang, forEach thuc hien tung cong viec mot
    list.forEach((o, i) => {
        const tr = document.createElement("tr");

        //BADGE_TONE: bien chua mau sac cho cac trang thai don hang, o.status: trang thai hien tại cua don hang
        //BILLING de kiem tra dieu kien hien thi phi van chuyen hay thoi gian truoc do
        //32 : phi ban dau, i: so thu tu don hang
        //8: thoi gian ban dau, i: so thu tu don hang
        tr.innerHTML = `<td><strong></strong></td><td></td><td></td>
        <td><span class="badge badge-${BADGE_TONE[o.status]}"></span></td><td>${BILLING ? (32 + i * 6) + ".000đ" : (8 + i * 13) + " phút trước"}</td>
        <!--tao nut xem chi tiet don hang-->
        <td><button class="text-btn">Xem <span class="bi bi-chevron-right"></span></button></td>`;

        // Đưa mã đơn hàng từ o.code vào ô đầu tiên của dòng vừa tạo.
        tr.children[0].firstChild.textContent = o.code;

        // Đưa tên người nhận từ o.name vào ô thứ hai của dòng.
        tr.children[1].textContent = o.name;

        tr.children[2].textContent = o.address;

        // Đưa trạng thái thực tế của đơn hàng vào phần tử có class="badge" để người dùng nhìn thấy trạng thái.
        tr.querySelector(".badge").textContent = o.status;

        // Khi người dùng bấm nút "Xem", gọi hàm showDetail(o) để mở cửa sổ hiển thị thông tin chi tiết của đơn hàng đó.
        tr.querySelector("button").onclick = () => showDetail(o);

        //Them dong vua tao vao bang hien thi dsach don hang
        $("rows").appendChild(tr);
    });

    //Neu dsach khong co don hang thi hien thi thong bao khong co don hang
    $("empty").hidden = list.length > 0;
}

//Tao ham de tao cac nut loc trang thai don hang
function renderFilters() {
    //Xoa cac nut loc cu
    $("filters").innerHTML = "";

    //Tao 4 lua chon loc
    ["Tất cả", "Đang giao", "Đã giao", "Ngoại lệ"].forEach((x) => {
        //Tao nut bam moi cho trang thai don hang
        const b = document.createElement("button");

        // filter === x: Kiểm tra xem trạng thái của nút hiện tại (x) có trùng với trạng thái mà người dùng đang chọn (filter) hay không.
        // nếu trùng thì b.className = "primary" (nút được tô màu nổi bật), nếu không truungf thi b.className = "secondary"(nút có màu nhạt hơn)
        b.className = filter === x ? "primary" : "secondary";

        // Đặt chữ hiển thị trên nút bằng tên trạng thái, ví dụ "Đang giao" hoặc "Đã giao".
        b.textContent = x;

        // Khi người dùng bấm nút, cập nhật trạng thái lọc, tạo lại các nút để làm nổi bật lựa chọn và hiển thị lại danh sách
        b.onclick = () => { filter = x; renderFilters(); render(); };

        //Thêm nút lọc vừa tạo vào filters để nút xuất hiện trên trang
        $("filters").appendChild(b);
    });
}

// Tạo hàm showDetail(o) để mở cửa sổ chi tiết của đơn hàng được người dùng chọn; o chứa thông tin đơn hàng đó.
function showDetail(o) {
    // Mở một cửa sổ dạng modal và lưu cửa sổ đó vào biến m để có thể thao tác với các phần tử bên trong.
    const m = openModal(`
    <!-- Tạo phần tiêu đề của cửa sổ chi tiết, gồm trạng thái đơn hàng, tên cửa sổ và mã đơn hàng sẽ được thêm bằng JavaScript. -->
    <div class="panel-title"><div><span class="badge badge-${BADGE_TONE[o.status]}"></span><h2>Chi tiết giao hàng</h2><p></p></div>

      <!-- Tạo nút × ở góc cửa sổ để người dùng có thể đóng cửa sổ chi tiết. -->
      <button class="icon-button" id="x" aria-label="Đóng">×</button></div>

    <!-- Hiển thị thông tin dịch vụ giao hàng, tài xế phụ trách và khoảng thời gian giao hàng dự kiến. -->
    <div class="case-meta"><div><span>Dịch vụ</span><strong>Giao tiêu chuẩn</strong></div>
      <div><span>Tài xế</span><strong>Nguyễn Văn Hùng</strong></div><div><span>Dự kiến</span><strong>14:30 – 15:15</strong></div></div>

    <!-- Tạo khu vực hiển thị địa chỉ nhận hàng; địa chỉ cụ thể sẽ được JavaScript điền vào phần tử id="addr". -->
    <div class="info-row"><span class="bi bi-geo-alt"></span><div><span>Địa chỉ nhận</span><strong id="addr"></strong></div></div>

    <!-- Nếu đơn hàng có trạng thái "Ngoại lệ", hiển thị thêm lý do giao hàng gặp sự cố để người dùng biết vấn đề. -->
    ${o.status === "Ngoại lệ" ? `<div class="problem-detail"><span class="bi bi-exclamation-triangle"></span><div><strong>Lý do ngoại lệ</strong><p>Không tìm thấy địa chỉ giao. Điều phối viên đang liên hệ để xác minh.</p></div></div>` : ""}

    <!-- Nếu đơn hàng đã giao thành công, hiển thị thông báo còn 11 ngày để đánh giá hoặc khiếu nại, quyền này hết hạn sau 14 ngày kể từ khi giao thành công. -->
    ${o.status === "Đã giao" ? `<div class="eligibility"><span class="bi bi-clock"></span><div><strong>Còn 11 ngày để đánh giá hoặc khiếu nại</strong><p>Quyền này hết hạn sau 14 ngày kể từ khi giao thành công.</p></div></div>` : ""}

    <!-- Tạo hai nút ở cuối cửa sổ: nút đóng cửa sổ và nút sao chép mã đơn hàng. -->
    <div class="form-actions"><button class="secondary" id="close">Đóng</button><button class="primary" id="copy">Sao chép mã đơn</button></div>`);

    // Đưa trạng thái thực tế của đơn hàng vào nhãn trạng thái trong cửa sổ chi tiết.
    m.querySelector(".badge").textContent = o.status;

    // Đưa mã đơn hàng vào thẻ <p> nằm trong phần tiêu đề của cửa sổ chi tiết.
    m.querySelector("p").textContent = o.code;

    // Ghép tên người nhận và địa chỉ giao hàng rồi đưa vào phần tử id="addr" để hiển thị địa chỉ nhận hàng.
    m.querySelector("#addr").textContent = `${o.name}, ${o.address}`;

    // Khi người dùng bấm nút × hoặc nút "Đóng", gọi closeModal để đóng cửa sổ chi tiết.
    m.querySelector("#x").onclick = m.querySelector("#close").onclick = closeModal;

    // Khi người dùng bấm nút "Sao chép mã đơn", thực hiện hàm bên dưới để sao chép mã đơn hàng và hiện thông báo.
    m.querySelector("#copy").onclick = () => {
        // Yêu cầu trình duyệt sao chép mã đơn hàng vào bộ nhớ tạm để người dùng có thể dán ở nơi khác; dấu ?. giúp tránh lỗi nếu clipboard không có sẵn.
        navigator.clipboard?.writeText(o.code);

        // Hiển thị thông báo "Đã sao chép" cùng nội dung cho biết mã vận đơn đã được sao chép.
        notify("Đã sao chép", "Mã vận đơn đã được sao chép.");

        // Kết thúc thao tác khi người dùng bấm nút sao chép mã đơn.
    };
}

// Nếu đây là trang đối soát, đổi tiêu đề cột thứ năm trong bảng thành "Phí vận chuyển"; nếu không phải thì giữ nguyên tiêu đề trong HTML.
if (BILLING) document.querySelector("th:nth-child(5)").textContent = "Phí vận chuyển";

// người dùng nhập hoặc xóa chữ trong ô tìm kiếm; mỗi lần nội dung thay đổi thì gọi render() để cập nhật danh sách.
$("q").addEventListener("input", render);

// Tạo các nút lọc trạng thái và hiển thị danh sách đơn hàng ngay khi JavaScript chạy.
renderFilters();
render();