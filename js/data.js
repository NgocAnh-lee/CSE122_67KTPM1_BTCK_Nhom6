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
