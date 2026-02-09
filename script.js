/* ====== CONFIG ====== */
const ADMIN_PASSWORD = "123456";
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

/* ====== LOAD DATA FROM LOCALSTORAGE ====== */
function loadData() {
  const container = document.getElementById("infoContainer");
  container.innerHTML = "";

  fields.forEach(f => {
    const value = localStorage.getItem(f.key) || "";
    container.innerHTML += `
      <div class="info-item">
        <span>${f.label}</span>
        <textarea disabled data-key="${f.key}">${value}</textarea>
        <button onclick="copyText(this)">📋</button>
      </div>
    `;
  });

  // Load name
  document.getElementById("fullName").innerText =
    localStorage.getItem("fullName") || "Nguyễn Gia Lâm";

  // Load avatar
  const avatar = localStorage.getItem("avatar");
  if (avatar) document.getElementById("avatarImg").src = avatar;
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
    openLogin();
  }
});

/* ====== LOGIN ====== */
function openLogin() {
  document.getElementById("loginPopup").style.display = "flex";
}
function closeLogin() {
  document.getElementById("loginPopup").style.display = "none";
}
function login() {
  if (document.getElementById("adminPass").value === ADMIN_PASSWORD) {
    isAdmin = true;
    enableEdit();
    closeLogin();
  } else {
    alert("Sai mật khẩu");
  }
}

/* ====== ENABLE ADMIN EDIT ====== */
function enableEdit() {
  document.querySelectorAll("textarea").forEach(t => t.disabled = false);
  document.getElementById("fullName").contentEditable = true;
  document.querySelector(".avatar-upload").style.display = "block";
  document.getElementById("saveBtn").style.display = "block";
}

/* ====== SAVE DATA ====== */
function saveData() {
  document.querySelectorAll("textarea").forEach(t => {
    localStorage.setItem(t.dataset.key, t.value);
  });

  localStorage.setItem(
    "fullName",
    document.getElementById("fullName").innerText
  );

  alert("Đã lưu thành công!");
}

/* ====== AVATAR UPLOAD ====== */
document.querySelector(".avatar-upload input").addEventListener("change", e => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    localStorage.setItem("avatar", reader.result);
    document.getElementById("avatarImg").src = reader.result;
  };
  reader.readAsDataURL(file);
});

/* INIT */
loadData();
