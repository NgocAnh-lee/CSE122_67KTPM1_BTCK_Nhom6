/* login.js - kiểm tra form và lưu phiên đăng nhập (chỉ là demo, không có backend). */
const DEMO_PASSWORD = "123456";
const form = document.getElementById("login-form");
const errorBox = document.getElementById("error");

function showError(msg) { document.getElementById("error-text").textContent = msg; errorBox.hidden = false; }

form.addEventListener("submit", (e) => {
  e.preventDefault();
  errorBox.hidden = true;
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const role = document.getElementById("role").value;
  if (!email || !password) return showError("Vui lòng nhập đầy đủ email và mật khẩu.");
  if (password !== DEMO_PASSWORD) return showError("Email hoặc mật khẩu không chính xác. Vui lòng thử lại.");
  localStorage.setItem("pp-session", JSON.stringify({ role, email })); // không lưu mật khẩu
  location.href = ROLES[role].pages[0][0] + ".html";
});

// Nếu đã đăng nhập thì vào thẳng trang của vai trò
const s = getSession();
if (s && ROLES[s.role]) location.href = ROLES[s.role].pages[0][0] + ".html";
