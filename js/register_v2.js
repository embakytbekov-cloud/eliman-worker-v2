// ----------------------------
// LANGUAGE + CATEGORY
// ----------------------------
let currentLang = "en";
let selectedCategory = null;

// ----------------------------
// i18n TRANSLATIONS
// ----------------------------
const i18n = {
  en: {
    langTitle: "Choose language",
    langSubtitle: "Select your language. Registration will appear in this language.",
    step1Title: "Profile",
    step1Subtitle: "Enter your personal and address information.",
    fullName: "Full name",
    phone: "Phone number",
    street: "Street, house",
    apt: "Apartment / office (optional)",
    city: "City",
    state: "State",
    zip: "ZIP code",
    next: "Next",
    step2Title: "Category",
    step2Subtitle: "Please choose your main working category.",
    next2: "Next",
    step3Title: "Profile photo",
    photoHint: "Click to upload",
    finish: "Finish",
    categoryAlert: "Please select a category",
    finishAlert: "Registration completed!",
    dbError: "Database error",
    saveError: "Error while saving data",
    uploadError: "Error while uploading photo"
  },

  ru: {
    langTitle: "Выберите язык",
    langSubtitle: "Выберите язык. Регистрация будет показана на нём.",
    step1Title: "Профиль",
    step1Subtitle: "Введите ваши данные и адрес.",
    fullName: "Полное имя",
    phone: "Телефон",
    street: "Улица, дом",
    apt: "Квартира / офис (необязательно)",
    city: "Город",
    state: "Штат",
    zip: "ZIP код",
    next: "Далее",
    step2Title: "Категория",
    step2Subtitle: "Выберите вашу категорию для обслуживания клиентов.",
    next2: "Далее",
    step3Title: "Фото профиля",
    photoHint: "Нажмите, чтобы загрузить",
    finish: "Завершить",
    categoryAlert: "Выберите категорию",
    finishAlert: "Регистрация завершена!",
    dbError: "Ошибка базы данных",
    saveError: "Ошибка при сохранении данных",
    uploadError: "Ошибка при загрузке фото"
  },

  es: {
    langTitle: "Elige tu idioma",
    langSubtitle: "La registración aparecerá en este idioma.",
    step1Title: "Perfil",
    step1Subtitle: "Ingresa tu información personal y dirección.",
    fullName: "Nombre completo",
    phone: "Teléfono",
    street: "Calle, número",
    apt: "Departamento / oficina (opcional)",
    city: "Ciudad",
    state: "Estado",
    zip: "Código ZIP",
    next: "Siguiente",
    step2Title: "Categoría",
    step2Subtitle: "Elige tu categoría principal de trabajo.",
    next2: "Siguiente",
    step3Title: "Foto de perfil",
    photoHint: "Toca para subir foto",
    finish: "Finalizar",
    categoryAlert: "Por favor elige una categoría",
    finishAlert: "¡Registro completado!",
    dbError: "Error de base de datos",
    saveError: "Error al guardar datos",
    uploadError: "Error al subir la foto"
  }
};


// ----------------------------
// APPLY TRANSLATIONS
// ----------------------------
function applyTranslations() {
  const t = i18n[currentLang];

  document.getElementById("langTitle").textContent = t.langTitle;
  document.getElementById("langSubtitle").textContent = t.langSubtitle;

  document.getElementById("step1Title").textContent = t.step1Title;
  document.getElementById("step1Subtitle").textContent = t.step1Subtitle;
  document.getElementById("fullName").placeholder = t.fullName;
  document.getElementById("phone").placeholder = t.phone;
  document.getElementById("street").placeholder = t.street;
  document.getElementById("apt").placeholder = t.apt;
  document.getElementById("city").placeholder = t.city;
  document.getElementById("state").placeholder = t.state;
  document.getElementById("zip").placeholder = t.zip;
  document.getElementById("next1").textContent = t.next;

  document.getElementById("step2Title").textContent = t.step2Title;
  document.getElementById("step2Subtitle").textContent = t.step2Subtitle;
  document.getElementById("next2").textContent = t.next2;

  document.getElementById("step3Title").textContent = t.step3Title;
  document.getElementById("photoBox").textContent = t.photoHint;
  document.getElementById("finishBtn").textContent = t.finish;
}


// ----------------------------
// TELEGRAM ID DETECTION
// ----------------------------
let telegramId = null;
let workerKey = null;

(function detectTelegram() {
  const tg = window.Telegram && window.Telegram.WebApp
    ? window.Telegram.WebApp
    : null;

  if (tg) {
    try { tg.ready(); } catch (_) {}

    if (tg.initDataUnsafe?.user?.id) {
      telegramId = String(tg.initDataUnsafe.user.id);
    }
  }

  workerKey = localStorage.getItem("telegram_id");
})();


// ----------------------------
// STEP SWITCHING
// ----------------------------
document.querySelectorAll(".lang").forEach(btn => {
  btn.addEventListener("click", () => {
    currentLang = btn.dataset.lang;
    applyTranslations();
    stepLang.classList.add("hidden");
    step1.classList.remove("hidden");
  });
});

next1.onclick = () => {
  step1.classList.add("hidden");
  step2.classList.remove("hidden");
};

document.querySelectorAll(".category").forEach(c => {
  c.onclick = () => {
    document.querySelectorAll(".category").forEach(x => x.classList.remove("selected"));
    c.classList.add("selected");
    selectedCategory = c.dataset.cat;
  };
});

next2.onclick = () => {
  if (!selectedCategory) {
    alert(i18n[currentLang].categoryAlert);
    return;
  }
  step2.classList.add("hidden");
  step3.classList.remove("hidden");
};


// ----------------------------
// PHOTO PREVIEW
// ----------------------------
photoBox.onclick = () => photoInput.click();

photoInput.onchange = e => {
  const file = e.target.files[0];
  if (!file) return;

  const url = URL.createObjectURL(file);
  photoBox.style.backgroundImage = `url(${url})`;
  photoBox.style.backgroundSize = "cover";
  photoBox.style.border = "none";
  photoBox.style.color = "transparent";
};


// ----------------------------
// SAVE TO SUPABASE
// ----------------------------
finishBtn.onclick = async () => {
  const t = i18n[currentLang];

  const full_name = fullName.value.trim();
  const phoneValue = phone.value.trim();
  const streetValue = street.value.trim();
  const aptValue = apt.value.trim();
  const cityValue = city.value.trim();
  const stateValue = state.value.trim();
  const zipValue = zip.value.trim();

  const file = photoInput.files[0];
  let photo_url = null;

  if (file) {
    const ext = file.name.split(".").pop() || "jpg";
    const filePath = `worker_${workerKey}.${ext}`;

    const { error: uploadErr } = await db.storage
      .from("workers_photos")
      .upload(filePath, file, { upsert: true });

    if (uploadErr) {
      alert(t.uploadError);
      console.error(uploadErr);
      return;
    }

    photo_url = db.storage.from("workers_photos").getPublicUrl(filePath).data.publicUrl;
  }

  const { error: insertErr } = await db.from("workers").insert({
    telegram_id: workerKey,
    full_name,
    phone: phoneValue,
    street: streetValue,
    apt: aptValue,
    city: cityValue,
    state: stateValue,
    zipcode: zipValue,
    category: selectedCategory,
    language: currentLang,
    lang: currentLang,
    photo: photo_url,
    accepted_terms: false,
    accepted_privacy: false,
    accepted_work_agreement: false
  });

  if (insertErr) {
    alert(t.saveError);
    console.error(insertErr);
    return;
  }

  window.location.href = `terms.html?lang=${currentLang}&worker_id=${workerKey}`;
};


// ----------------------------
// INIT
// ----------------------------
applyTranslations();
