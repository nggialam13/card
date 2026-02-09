/* ====== CONFIG ====== */
let isAdmin = false;

/* ====== DATA STRUCTURE ====== */
const fields = [
  { label: "🏠 Thường trú", key: "address1" },
  { label: "📍 Tạm trú", key: "address2" },
  { label: "📞 SDT/Zalo", key: "phone" },
  { label: "📧 Email", key: "email" },
  { label: "📘 Facebook", key: "facebook" },
  { label: "📸 Instagram", key: "instagram" },
];

/* ====== INIT DATA (Không load từ localStorage) ====== */
function initData() {
  const container = document.getElementById("infoContainer");
  container.innerHTML = "";

  fields.forEach(f => {
    container.innerHTML += `
      <div class="info-item">
        <span>${f.label}</span>
        <textarea disabled data-key="${f.key}"></textarea>
        <button onclick="copyText(this)">📋</button>
      </div>
    `;
  });

  // Set default name
  document.getElementById("fullName").innerText = "Nguyễn Gia Lâm";
}

/* ====== COPY ====== */
function copyText(btn) {
  const textarea = btn.previousElementSibling;
  navigator.clipboard.writeText(textarea.value);
  showToast();
}

/* ====== TOAST ====== */
function showToast() {
  const toast = document.getElementById("toast");
  toast.style.display = "block";
  setTimeout(() => toast.style.display = "none", 1500);
}

/* ====== ADMIN HOTKEY (CTRL + SHIFT + A) ====== */
document.addEventListener("keydown", e => {
  if (e.ctrlKey && e.shiftKey && e.key === "A") {
    isAdmin = !isAdmin;
    if (isAdmin) {
      loadSavedData();
      showAdminButtons();
      alert("Đã bật chế độ Admin");
    } else {
      hideAdminButtons();
      disableEdit();
      alert("Đã tắt chế độ Admin");
    }
  }
});

/* ====== LOAD SAVED DATA (Chỉ khi admin) ====== */
function loadSavedData() {
  // Load các textarea
  document.querySelectorAll("textarea").forEach(t => {
    const saved = localStorage.getItem(t.dataset.key);
    if (saved) t.value = saved;
  });

  // Load tên
  const savedName = localStorage.getItem("fullName");
  if (savedName) {
    document.getElementById("fullName").innerText = savedName;
  }

  // Load avatar
  const avatar = localStorage.getItem("avatar");
  if (avatar) {
    document.getElementById("avatarImg").src = avatar;
  }
}

/* ====== SHOW/HIDE ADMIN BUTTONS ====== */
function showAdminButtons() {
  document.getElementById("editBtn").style.display = "block";
  document.getElementById("saveBtn").style.display = "block";
  document.querySelector(".avatar-upload").style.display = "block";
}

function hideAdminButtons() {
  document.getElementById("editBtn").style.display = "none";
  document.getElementById("saveBtn").style.display = "none";
  document.querySelector(".avatar-upload").style.display = "none";
}

/* ====== ENABLE EDIT MODE ====== */
function enableEdit() {
  if (!isAdmin) return;
  
  document.querySelectorAll("textarea").forEach(t => {
    t.disabled = false;
  });
  
  document.getElementById("fullName").contentEditable = true;
}

/* ====== DISABLE EDIT MODE ====== */
function disableEdit() {
  document.querySelectorAll("textarea").forEach(t => {
    t.disabled = true;
  });
  
  document.getElementById("fullName").contentEditable = false;
}

/* ====== SAVE DATA ====== */
function saveData() {
  if (!isAdmin) return;
  
  // Lưu các textarea
  document.querySelectorAll("textarea").forEach(t => {
    localStorage.setItem(t.dataset.key, t.value);
  });

  // Lưu tên
  localStorage.setItem(
    "fullName",
    document.getElementById("fullName").innerText
  );

  // Vô hiệu hóa chỉnh sửa sau khi lưu
  disableEdit();
  
  alert("Đã lưu thành công!");
}

/* ====== AVATAR UPLOAD ====== */
const avatarInput = document.querySelector(".avatar-upload input");
if (avatarInput) {
  avatarInput.addEventListener("change", e => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      localStorage.setItem("avatar", reader.result);
      document.getElementById("avatarImg").src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

/* INIT */
initData();
