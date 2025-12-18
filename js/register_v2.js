// ============================
// DOM ELEMENTS (FIX!!!)
// ============================
const stepLang = document.getElementById("stepLang");
const step1 = document.getElementById("step1");
const step2 = document.getElementById("step2");
const step3 = document.getElementById("step3");

const next1 = document.getElementById("next1");
const next2 = document.getElementById("next2");
const finishBtn = document.getElementById("finishBtn");

const photoBox = document.getElementById("photoBox");
const photoInput = document.getElementById("photoInput");


// ----------------------------
// LANGUAGE + CATEGORY
// ----------------------------
let currentLang = "en";
let selectedCategory = null;


// ----------------------------
// i18n
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
    categoryAlert: "Please select a category"
  },
  ru: {
    langTitle: "Выберите язык",
    langSubtitle: "Выберите язык. Регистрация будет показана на нём.",
    step1Title: "Профиль",
    step1Subtitle: "Введите ваши данные.",
    fullName: "Полное имя",
    phone: "Телефон",
    street: "Улица, дом",
    apt: "Квартира / офис",
    city: "Город",
    state: "Штат",
    zip: "ZIP код",
    next: "Далее",
    step2Title: "Категория",
    step2Subtitle: "Выберите категорию.",
    next2: "Далее",
    step3Title: "Фото профиля",
    photoHint: "Нажмите, чтобы загрузить",
    finish: "Завершить",
    categoryAlert: "Выберите категорию"
  },
  es: {
    langTitle: "Elige tu idioma",
    langSubtitle: "La registración aparecerá en este idioma.",
    step1Title: "Perfil",
    step1Subtitle: "Ingresa tus datos.",
    fullName: "Nombre completo",
    phone: "Teléfono",
    street: "Calle",
    apt: "Apartamento",
    city: "Ciudad",
    state: "Estado",
    zip: "ZIP",
    next: "Siguiente",
    step2Title: "Categoría",
    step2Subtitle: "Elige una categoría.",
    next2: "Siguiente",
    step3Title: "Foto de perfil",
    photoHint: "Toca para subir",
    finish: "Finalizar",
    categoryAlert: "Elige una categoría"
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

  next1.textContent = t.next;
  document.getElementById("step2Title").textContent = t.step2Title;
  document.getElementById("step2Subtitle").textContent = t.step2Subtitle;
  next2.textContent = t.next2;

  document.getElementById("step3Title").textContent = t.step3Title;
  photoBox.textContent = t.photoHint;
  finishBtn.textContent = t.finish;
}


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
// PHOTO
// ----------------------------
photoBox.onclick = () => photoInput.click();

photoInput.onchange = e => {
  const file = e.target.files[0];
  if (!file) return;
  photoBox.style.backgroundImage = `url(${URL.createObjectURL(file)})`;
  photoBox.style.backgroundSize = "cover";
  photoBox.style.border = "none";
  photoBox.textContent = "";
};


// ----------------------------
// INIT
// ----------------------------
applyTranslations();