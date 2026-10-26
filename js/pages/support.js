// Dựng khung trang theo vai trò, tiêu đề, phụ đề
initShell({
    role:"recipient",
    page:"recipient/support",
    title:"Phản hồi sự cố",
    subtitle:"Gửi yêu cầu hỗ trợ đến trung tâm điều phối"
});

// $("id") là viết tắt của document.getElementById("id")
const $ = (id) => document.getElementById(id);

// getItem đọc chuỗi đã lưu, JSON.parse đổi chuỗi về mảng, || [] dùng mảng rỗng nếu chưa có dữ liệu
// try/catch để dữ liệu lưu bị hỏng thì trang không bị sập
let tickets = [];
try { tickets = JSON.parse(localStorage.getItem("pp-tickets")) || []; } catch {}
if (!tickets.length) tickets = [{ id :"SP-0941", title:"Sai địa chỉ", status: "Đã giải quyết - 12/05/2025", open:false}];

// forEach chạy cho từng đơn hàng, select.add(new Option(chữ)) thêm 1 lựa chọn vào ô chọn
ORDERS.forEach((o) => $("order").add(new Option(`${o.code} - ${o.status}`)));

function renderHistory(){
    // innerHTML = "" xóa danh sách cũ để vẽ lại từ đầu
    $("history").innerHTML ="";
    // hidden = true thì ẩn, false thì hiện (ẩn dòng "chưa có yêu cầu" khi đã có dữ liệu)
    $("empty").hidden = tickets.length > 0;
    tickets.forEach((t) => {
        // createElement tạo thẻ trong bộ nhớ, chưa hiện ra trang
        const d = document.createElement("div");
        if (t.open) d.className = "active";
        d.innerHTML = `<i><span class="bi ${t.open ? "bi-hourglass-split" : "bi-check-lg"}"></span></i><div><strong></strong><p></p></div>`;
        // querySelector tìm thẻ con đầu tiên khớp, textContent gán chữ vào thẻ
        d.querySelector("strong").textContent = `${t.id} - ${t.title}`;
        d.querySelector("p").textContent = t.status;
        // appendChild gắn thẻ vào trang thì mới hiện ra
        $("history").appendChild(d);
    });
}

// addEventListener("submit", ...) chạy hàm khi bấm gửi form
$("form").addEventListener("submit", (e) =>{
    // preventDefault chặn trang tải lại, để JS tự xử lý
    e.preventDefault();
    // .value lấy chữ trong ô nhập, trim() cắt khoảng trắng hai đầu
    const detail = $("detail").value.trim();
    if(detail.length < 10) {
        $("err").textContent = "Vui lòng mô tả ít nhất 10 ký tự.";
        $("err").hidden = false;
        // return dừng hàm, không gửi nữa
        return;
    }
    $("err").hidden = true;
    const id = "SP-" + (1085 + tickets.length);
    // unshift thêm vào đầu mảng (push là thêm vào cuối), nên yêu cầu mới nằm trên cùng
    tickets.unshift({id, title: $("issue").value, status: "Đang chờ điều phối viên - vừa xong", open:true});
    // JSON.stringify đổi mảng thành chuỗi, setItem lưu vào trình duyệt, tắt trang vẫn còn
    localStorage.setItem("pp-tickets", JSON.stringify(tickets));
    $("code").textContent = "Mã yêu cầu: " + id;
    // Ẩn form, hiện màn hình thành công, vẽ lại lịch sử
    $("form").hidden = true;
    $("done").hidden = false;
    renderHistory();
});

// reset() đưa các ô nhập về trạng thái ban đầu, rồi hiện lại form
$("again").onclick = () => {$("form").reset(); $("form").hidden = false; $("done").hidden = true; };

renderHistory();