let currentLang = "en";
let selectedCategory = null;

/* ---------- i18n ---------- */
const i18n = {
  en: {
    langTitle: "Choose language",
    langSubtitle: "Select your language. Registration will be shown in your language.",
    step1Title: "Profile",
    step1Subtitle: "Enter your details",
    step2Title: "Category",
    step2Subtitle: "Choose your service category",
    step3Title: "Profile photo",
    next: "Next",
    finish: "Finish",
    categoryAlert: "Please select a category"
  },
  ru: {
    langTitle: "Выберите язык",
    langSubtitle: "Регистрация будет показана на выбранном языке",
    step1Title: "Профиль",
    step1Subtitle: "Введите ваши данные",
    step2Title: "Категория",
    step2Subtitle: "Выберите категорию",
    step3Title: "Фото профиля",
    next: "Далее",
    finish: "Завершить",
    categoryAlert: "Выберите категорию"
  },
  es: {
    langTitle: "Elige idioma",
    langSubtitle: "Registro en este idioma",
    step1Title: "Perfil",
    step1Subtitle: "Ingresa tus datos",
    step2Title: "Categoría",
    step2Subtitle: "Elige categoría",
    step3Title: "Foto de perfil",
    next: "Siguiente",
    finish: "Finalizar",
    categoryAlert: "Selecciona una categoría"
  }
};

function applyTranslations() {
  const t = i18n[currentLang];
  langTitle.textContent = t.langTitle;
  langSubtitle.textContent = t.langSubtitle;
  step1Title.textContent = t.step1Title;
  step1Subtitle.textContent = t.step1Subtitle;
  step2Title.textContent = t.step2Title;
  step2Subtitle.textContent = t.step2Subtitle;
  step3Title.textContent = t.step3Title;
  next1.textContent = t.next;
  next2.textContent = t.next;
  finishBtn.textContent = t.finish;
}

/* ---------- STEPS ---------- */
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

/* ---------- PHOTO (iOS SAFE) ---------- */
photoInput.onchange = e => {
  const file = e.target.files[0];
  if (!file) return;

  const url = URL.createObjectURL(file);
  const box = photoInput.parentElement;

  box.style.backgroundImage = `url(${url})`;
  box.style.backgroundSize = "cover";
  box.style.backgroundPosition = "center";
  photoText.style.display = "none";
};

/* ---------- FINISH ---------- */
finishBtn.onclick = () => {
  alert("Registration step completed ✅");
};

applyTranslations();