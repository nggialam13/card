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

/* ====== INIT DATA (Load từ data.json và localStorage) ====== */
async function initData() {
  let data = {};
  
  // Thử load từ data.json
  try {
    const response = await fetch('data.json');
    if (response.ok) {
      data = await response.json();
    }
  } catch (e) {
    console.log('Không thể load data.json, sử dụng localStorage');
  }
  
  // Ưu tiên localStorage nếu có (cho admin override)
  fields.forEach(f => {
    const localValue = localStorage.getItem(f.key);
    if (localValue !== null && localValue !== "") {
      data[f.key] = localValue;
    }
  });
  
  const localName = localStorage.getItem("fullName");
  if (localName) {
    data.fullName = localName;
  }
  
  const localAvatar = localStorage.getItem("avatar");
  if (localAvatar) {
    data.avatar = localAvatar;
  }

  // Render UI
  const container = document.getElementById("infoContainer");
  container.innerHTML = "";

  fields.forEach(f => {
    const value = data[f.key] || "";
    container.innerHTML += `
      <div class="info-item">
        <span>${f.label}</span>
        <textarea disabled data-key="${f.key}">${value}</textarea>
        <button onclick="copyText(this)">📋</button>
      </div>
    `;
  });

  // Set name
  document.getElementById("fullName").innerText = data.fullName || "Nguyễn Gia Lâm";

  // Set avatar
  if (data.avatar) {
    document.getElementById("avatarImg").src = data.avatar;
  }
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

/* ====== TOGGLE ADMIN MODE ====== */
function toggleAdmin() {
  isAdmin = !isAdmin;
  const adminBtn = document.getElementById("adminToggleBtn");
  
  if (isAdmin) {
    showAdminButtons();
    adminBtn.textContent = "🔓 Tắt Admin";
    adminBtn.classList.add("active");
  } else {
    hideAdminButtons();
    disableEdit();
    adminBtn.textContent = "🔐 Admin";
    adminBtn.classList.remove("active");
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
