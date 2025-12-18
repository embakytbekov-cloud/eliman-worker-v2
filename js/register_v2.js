// ============================
// INIT AFTER DOM READY
// ============================
document.addEventListener("DOMContentLoaded", () => {

  // ----------------------------
  // STATE
  // ----------------------------
  let currentLang = "en";
  let selectedCategory = null;

  // ----------------------------
  // ELEMENTS
  // ----------------------------
  const stepLang = document.getElementById("stepLang");
  const step1 = document.getElementById("step1");
  const step2 = document.getElementById("step2");
  const step3 = document.getElementById("step3");

  const next1 = document.getElementById("next1");
  const next2 = document.getElementById("next2");
  const finishBtn = document.getElementById("finishBtn");

  const photoBox = document.getElementById("photoBox");
  const photoInput = document.getElementById("photoInput");

  const fullName = document.getElementById("fullName");
  const phone = document.getElementById("phone");
  const street = document.getElementById("street");
  const apt = document.getElementById("apt");
  const city = document.getElementById("city");
  const state = document.getElementById("state");
  const zip = document.getElementById("zip");

  // ----------------------------
  // i18n
  // ----------------------------
  const i18n = {
    en: {
      langTitle: "Choose language",
      langSubtitle: "Select your language. Registration will appear in this language.",
      step1Title: "Profile",
      step1Subtitle: "Enter your details",
      fullName: "Full name",
      phone: "Phone number",
      street: "Street, house",
      apt: "Apartment / office",
      city: "City",
      state: "State",
      zip: "ZIP code",
      next: "Next",
      step2Title: "Category",
      step2Subtitle: "Please choose your service category.",
      next2: "Next",
      step3Title: "Profile photo",
      photoHint: "Click to upload",
      finish: "Finish",
      categoryAlert: "Please select a category"
    },
    ru: {
      langTitle: "Выберите язык",
      langSubtitle: "Регистрация будет показана на выбранном языке.",
      step1Title: "Профиль",
      step1Subtitle: "Введите данные",
      fullName: "Полное имя",
      phone: "Телефон",
      street: "Улица, дом",
      apt: "Квартира / офис",
      city: "Город",
      state: "Штат",
      zip: "ZIP код",
      next: "Далее",
      step2Title: "Категория",
      step2Subtitle: "Выберите категорию",
      next2: "Далее",
      step3Title: "Фото профиля",
      photoHint: "Нажмите для загрузки",
      finish: "Завершить",
      categoryAlert: "Выберите категорию"
    }
  };

  function applyTranslations() {
    const t = i18n[currentLang];
    document.getElementById("langTitle").textContent = t.langTitle;
    document.getElementById("langSubtitle").textContent = t.langSubtitle;
    document.getElementById("step1Title").textContent = t.step1Title;
    document.getElementById("step1Subtitle").textContent = t.step1Subtitle;
    fullName.placeholder = t.fullName;
    phone.placeholder = t.phone;
    street.placeholder = t.street;
    apt.placeholder = t.apt;
    city.placeholder = t.city;
    state.placeholder = t.state;
    zip.placeholder = t.zip;
    next1.textContent = t.next;
    document.getElementById("step2Title").textContent = t.step2Title;
    document.getElementById("step2Subtitle").textContent = t.step2Subtitle;
    next2.textContent = t.next2;
    document.getElementById("step3Title").textContent = t.step3Title;
    photoBox.textContent = t.photoHint;
    finishBtn.textContent = t.finish;
  }

  // ----------------------------
  // LANGUAGE
  // ----------------------------
  document.querySelectorAll(".lang").forEach(btn => {
    btn.addEventListener("click", () => {
      currentLang = btn.dataset.lang;
      applyTranslations();
      stepLang.classList.add("hidden");
      step1.classList.remove("hidden");
    });
  });

  // ----------------------------
  // STEP 1 → STEP 2
  // ----------------------------
  next1.onclick = () => {
    step1.classList.add("hidden");
    step2.classList.remove("hidden");
  };

  // ----------------------------
  // CATEGORY
  // ----------------------------
  document.querySelectorAll(".category").forEach(cat => {
    cat.onclick = () => {
      document.querySelectorAll(".category").forEach(x => x.classList.remove("selected"));
      cat.classList.add("selected");
      selectedCategory = cat.dataset.cat;
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
});