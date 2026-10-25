/* data.js - dữ liệu giả lập dùng chung (sau này có thể chuyển sang assets/data/*.json). */
const ORDERS = [
  { code: "PPVN-8246-1937", name: "Phạm Minh Phương", address: "Cầu Giấy, Hà Nội", status: "Đang giao" },
  { code: "PPVN-7153-9021", name: "Lê Hải Anh", address: "Nam Từ Liêm, Hà Nội", status: "Ngoại lệ" },
  { code: "PPVN-6330-1842", name: "Vũ Hoàng Nam", address: "Ba Đình, Hà Nội", status: "Đã giao" },
  { code: "PPVN-5109-2287", name: "Nguyễn Thu Hà", address: "Hai Bà Trưng, Hà Nội", status: "Chờ lấy" },
];

/* Điểm dừng trên tuyến CG-04 (trang Lộ trình, Danh sách đơn, Chi tiết điểm dừng) */
const STOPS = [
  { time: "08:30", name: "Nguyễn Thu Hà", address: "24 Duy Tân, Cầu Giấy", status: "Đã giao", tone: "green", code: "PPVN-8041-2836" },
  { time: "09:15", name: "Trần Quốc Minh", address: "88 Trần Thái Tông, Cầu Giấy", status: "Đã giao", tone: "green", code: "PPVN-7153-9021" },
  { time: "10:20", name: "Lê Hải Anh", address: "12 Trung Kính, Cầu Giấy", status: "Khách vắng", tone: "orange", code: "PPVN-6330-1842" },
  { time: "11:10", name: "Phạm Minh Phương", address: "18 Trần Thái Tông, Cầu Giấy", status: "Đang giao", tone: "blue", code: "PPVN-8246-1937" },
  { time: "12:05", name: "Vũ Hoàng Nam", address: "139 Cầu Giấy, Cầu Giấy", status: "Sắp tới", tone: "gray", code: "PPVN-5109-2287" },
];
/* Đọc / ghi danh sách đơn tài xế đã tích hoàn thành (dùng chung trang Danh sách đơn và Minh chứng) */
const getDone = () => { try { return JSON.parse(localStorage.getItem("pp-driver-done")) || [0]; } catch { return [0]; } };
const setDone = (a) => localStorage.setItem("pp-driver-done", JSON.stringify(a));

/* Ca ngoại lệ (Hàng đợi ngoại lệ, Tổng quan vận hành) */
const EXC_CASES = [
  { id: "EX-2048", type: "Khách hàng vắng mặt", code: "PPVN-8246-1937", open: "12 phút", route: "CG-04", level: "Cao",
    detail: "Tài xế đã đến đúng địa chỉ, gọi 3 lần nhưng khách không nghe máy. Bảo vệ từ chối nhận hộ.",
    action: "Liên hệ người nhận và lên lịch giao lại", why: "Dữ liệu cho thấy khách thường phản hồi sau 14:00. Đề xuất giao lại khung 17:00–20:00 hôm nay.", conf: 91 },
  { id: "EX-2047", type: "Không tìm thấy địa chỉ", code: "PPVN-7153-9021", open: "28 phút", route: "BD-11", level: "Cao",
    detail: "Số nhà không tồn tại trên tuyến đường và vị trí ghim cách địa chỉ mô tả hơn 2 km.",
    action: "Xác minh địa chỉ với người nhận", why: "Vị trí ghim lệch hơn 2 km so với địa chỉ mô tả, cần người nhận gửi lại vị trí chính xác.", conf: 87 },
  { id: "EX-2045", type: "Kiện hàng có dấu hiệu hư hỏng", code: "PPVN-6330-1842", open: "42 phút", route: "HK-02", level: "Trung bình",
    detail: "Góc hộp bị móp và có vết ẩm khi tài xế lấy kiện ra khỏi xe. Chưa bàn giao cho khách.",
    action: "Chụp ảnh bằng chứng và hoàn về người gửi", why: "Kiện chưa bàn giao và có dấu hiệu hư hỏng, nên lập biên bản trước khi hoàn.", conf: 83 },
  { id: "EX-2041", type: "Khách đổi lịch", code: "PPVN-5109-2287", open: "1 giờ", route: "TX-08", level: "Thấp",
    detail: "Người nhận yêu cầu giao vào buổi tối vì không có mặt ở nhà ban ngày.",
    action: "Xếp lại vào khung 17:00–20:00", why: "Khung giờ khách chọn còn trống trên tuyến.", conf: 95 },
];
const DRIVERS = [
  { name: "Trần Minh Đức", dist: "1.2 km", load: "4 / 12 điểm", ontime: "98%" },
  { name: "Lê Quốc Anh", dist: "2.8 km", load: "7 / 14 điểm", ontime: "95%" },
  { name: "Nguyễn Hoàng Nam", dist: "3.5 km", load: "5 / 11 điểm", ontime: "92%" },
];
