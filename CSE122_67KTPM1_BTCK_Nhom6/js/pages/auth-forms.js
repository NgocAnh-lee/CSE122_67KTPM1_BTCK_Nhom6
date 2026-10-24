/* auth-forms.js - xử lý 5 màn hình: register, forgot-password, otp, reset-password, appeal.
   Trang nào chạy phần nào được quyết định bởi <body data-form="...">. */
const $ = (id) => document.getElementById(id);
const form = $("form"), kind = document.body.dataset.form;
const val = (id) => $(id).value.trim();
const fail = (m) => { $("error-text").textContent = m; $("error").hidden = false; };
const finish = (title, text) => { form.hidden = true; $("done").hidden = false; $("done-title").textContent = title; $("done-text").textContent = text; };
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/, PHONE = /^0\d{9}$/;
const isContact = (v) => EMAIL.test(v) || PHONE.test(v);

if (kind === "otp") {
  $("sent-to").textContent = sessionStorage.getItem("pp-reset-contact") || "email của bạn";
  for (let i = 0; i < 6; i++) {                       // 6 ô nhập, tự nhảy sang ô kế tiếp
    const inp = document.createElement("input");
    inp.maxLength = 1; inp.inputMode = "numeric"; inp.setAttribute("aria-label", "Chữ số " + (i + 1));
    inp.oninput = () => { inp.value = inp.value.replace(/\D/g, ""); if (inp.value) inp.nextElementSibling?.focus(); };
    $("otp").appendChild(inp);
  }
  $("resend").onclick = () => notify("Đã gửi lại mã", "Mã mới đã được gửi (demo: 123456).");
}
form.addEventListener("submit", (e) => {
  e.preventDefault(); $("error").hidden = true;
  if (kind === "register") {
    if (val("name").length < 2) return fail("Vui lòng nhập họ và tên.");
    if (!EMAIL.test(val("email"))) return fail("Email chưa đúng định dạng.");
    if (!PHONE.test(val("phone"))) return fail("Số điện thoại phải gồm 10 chữ số, bắt đầu bằng 0.");
    if ($("password").value.length < 6) return fail("Mật khẩu tối thiểu 6 ký tự.");
    const list = JSON.parse(localStorage.getItem("pp-pending-users") || "[]");
    if (list.some((u) => u[1] === val("email"))) return fail("Email này đã gửi yêu cầu và đang chờ duyệt.");
    list.push([val("name"), val("email"), val("phone"), val("area"), val("role")]);   // không lưu mật khẩu
    localStorage.setItem("pp-pending-users", JSON.stringify(list));
    finish("Đã gửi yêu cầu", "Tài khoản đang chờ quản trị viên duyệt. Bạn sẽ đăng nhập được sau khi được duyệt.");
  }
  if (kind === "forgot-password") {
    if (!isContact(val("contact"))) return fail("Vui lòng nhập email hoặc số điện thoại hợp lệ.");
    sessionStorage.setItem("pp-reset-contact", val("contact")); location.href = "otp.html";
  }
  if (kind === "otp") {
    const code = [...$("otp").children].map((i) => i.value).join("");
    if (code.length < 6) return fail("Vui lòng nhập đủ 6 chữ số.");
    if (code !== "123456") return fail("Mã xác thực không đúng. Vui lòng thử lại.");
    location.href = "reset-password.html";
  }
  if (kind === "reset-password") {
    if ($("p1").value.length < 6) return fail("Mật khẩu cần ít nhất 6 ký tự.");
    if ($("p1").value !== $("p2").value) return fail("Hai mật khẩu chưa trùng khớp.");
    finish("Đã đặt lại mật khẩu", "Bạn có thể đăng nhập bằng mật khẩu mới. (Bản demo vẫn dùng mật khẩu 123456.)");
  }
  if (kind === "appeal") {
    if (!isContact(val("contact"))) return fail("Vui lòng nhập email hoặc số điện thoại hợp lệ.");
    if (val("text").length < 10) return fail("Nội dung khiếu nại cần ít nhất 10 ký tự.");
    const list = JSON.parse(localStorage.getItem("pp-appeals") || "[]");
    list.push({ contact: val("contact"), text: val("text") });
    localStorage.setItem("pp-appeals", JSON.stringify(list));
    finish("Đã gửi khiếu nại", "Quản trị viên sẽ kiểm tra tài khoản và phản hồi trong vòng 24 giờ.");
  }
});
