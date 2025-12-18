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
    saveError: "Ошибка при сохранении данных",
    uploadError: "Ошибка при загрузке фото"
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
// TELEGRAM + WORKER INIT
// ----------------------------
const tg = window.Telegram.WebApp;
tg.ready();

const telegramId = tg.initDataUnsafe?.user?.id;
let CURRENT_WORKER = null;

async function getOrCreateWorker() {
  const { data: worker } = await db
    .from("workers")
    .select("*")
    .eq("telegram_id", telegramId)
    .maybeSingle();

  if (worker) return worker;

  const { data: newWorker } = await db
    .from("workers")
    .insert({
      telegram_id: telegramId,
      categories: []
    })
    .select()
    .single();

  return newWorker;
}

getOrCreateWorker().then(w => {
  CURRENT_WORKER = w;
});

// ----------------------------
// STEP SWITCHING
// ----------------------------
document.querySelectorAll(".lang").forEach(btn => {
  btn.onclick = () => {
    currentLang = btn.dataset.lang;
    applyTranslations();
    stepLang.classList.add("hidden");
    step1.classList.remove("hidden");
  };
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
// SAVE (UPDATE ONLY)
// ----------------------------
finishBtn.onclick = async () => {
  const t = i18n[currentLang];
  let photo_url = null;

  const file = photoInput.files[0];
  if (file) {
    const ext = file.name.split(".").pop();
    const path = `worker_${telegramId}.${ext}`;

    const { error } = await db.storage
      .from("workers_photos")
      .upload(path, file, { upsert: true });

    if (error) {
      alert(t.uploadError);
      return;
    }

    photo_url = db.storage
      .from("workers_photos")
      .getPublicUrl(path).data.publicUrl;
  }

  const { error } = await db
    .from("workers")
    .update({
      full_name: fullName.value.trim(),
      phone: phone.value.trim(),
      street: street.value.trim(),
      apt: apt.value.trim(),
      city: city.value.trim(),
      state: state.value.trim(),
      zipcode: zip.value.trim(),
      categories: [selectedCategory],
      language: currentLang,
      photo: photo_url
    })
    .eq("telegram_id", telegramId);

  if (error) {
    alert(t.saveError);
    return;
  }

  window.location.href = `terms.html?lang=${currentLang}`;
};

// ----------------------------
applyTranslations();