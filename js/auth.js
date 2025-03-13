// Các hàm hỗ trợ quản lý tài khoản bằng localStorage

function loadUsers() {
  const users = localStorage.getItem("users");
  return users ? JSON.parse(users) : {};
}

function saveUsers(users) {
  localStorage.setItem("users", JSON.stringify(users));
}

document.addEventListener("DOMContentLoaded", function() {
  const registerForm = document.getElementById("register-form");
  if(registerForm) {
    registerForm.addEventListener("submit", function(e) {
      e.preventDefault();
      const username = document.getElementById("reg-username").value.trim();
      const email = document.getElementById("reg-email").value.trim();
      const password = document.getElementById("reg-password").value;
      const confirmPassword = document.getElementById("reg-confirm").value;
      
      if(password !== confirmPassword) {
        alert("Mật khẩu và xác nhận mật khẩu không khớp!");
        return;
      }
      
      let users = loadUsers();
      if(users[username]) {
        alert("Tên đăng nhập đã tồn tại!");
        return;
      }
      
      users[username] = { email: email, password: password };
      saveUsers(users);
      alert("Đăng ký thành công! Vui lòng đăng nhập.");
      window.location.href = "login.html";
    });
  }
  
  const loginForm = document.getElementById("login-form");
  if(loginForm) {
    loginForm.addEventListener("submit", function(e) {
      e.preventDefault();
      const username = document.getElementById("login-username").value.trim();
      const password = document.getElementById("login-password").value;
      let users = loadUsers();
      if(users[username] && users[username].password === password) {
        localStorage.setItem("currentUser", username);
        alert("Đăng nhập thành công!");
        window.location.href = "index.html";
      } else {
        alert("Tên đăng nhập hoặc mật khẩu không đúng!");
      }
    });
  }
  
  const forgotForm = document.getElementById("forgot-password-form");
  if(forgotForm) {
    forgotForm.addEventListener("submit", function(e) {
      e.preventDefault();
      const fpUsername = document.getElementById("fp-username").value.trim();
      let users = loadUsers();
      const resultDiv = document.getElementById("fp-result");
      if(users[fpUsername]) {
        resultDiv.textContent = "Mật khẩu của bạn là: " + users[fpUsername].password;
      } else {
        resultDiv.textContent = "Không tìm thấy người dùng!";
      }
    });
  }
  
  updateNav();
});

function updateNav() {
  const currentUser = localStorage.getItem("currentUser");
  const btnLogin = document.getElementById("btn-login");
  const btnRegister = document.getElementById("btn-register");
  const btnAccount = document.getElementById("btn-account");
  const btnLogout = document.getElementById("btn-logout");
  
  if(currentUser) {
    if(btnLogin) btnLogin.style.display = "none";
    if(btnRegister) btnRegister.style.display = "none";
    if(btnAccount) btnAccount.style.display = "inline-block";
    if(btnLogout) btnLogout.style.display = "inline-block";
  } else {
    if(btnLogin) btnLogin.style.display = "inline-block";
    if(btnRegister) btnRegister.style.display = "inline-block";
    if(btnAccount) btnAccount.style.display = "none";
    if(btnLogout) btnLogout.style.display = "none";
  }
}

function logout() {
  localStorage.removeItem("currentUser");
  updateNav();
  alert("Bạn đã đăng xuất.");
  window.location.href = "index.html";
}
