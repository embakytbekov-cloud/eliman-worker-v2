document.addEventListener("DOMContentLoaded", () => {

  let currentLang = "en";
  let selectedCategory = null;

  const stepLang = document.getElementById("stepLang");
  const step1 = document.getElementById("step1");
  const step2 = document.getElementById("step2");
  const step3 = document.getElementById("step3");

  const next1 = document.getElementById("next1");
  const next2 = document.getElementById("next2");
  const finishBtn = document.getElementById("finishBtn");

  const photoInput = document.getElementById("photoInput");
  const photoBox = document.getElementById("photoBox");

  /* ---------- LANGUAGE ---------- */
  document.querySelectorAll(".lang").forEach(btn => {
    btn.addEventListener("click", () => {
      currentLang = btn.dataset.lang;
      stepLang.classList.add("hidden");
      step1.classList.remove("hidden");
    });
  });

  /* ---------- STEP 1 ---------- */
  next1.addEventListener("click", () => {
    step1.classList.add("hidden");
    step2.classList.remove("hidden");
  });

  /* ---------- CATEGORY ---------- */
  document.querySelectorAll(".category").forEach(c => {
    c.addEventListener("click", () => {
      document.querySelectorAll(".category")
        .forEach(x => x.classList.remove("selected"));
      c.classList.add("selected");
      selectedCategory = c.dataset.cat;
    });
  });

  next2.addEventListener("click", () => {
    if (!selectedCategory) {
      alert("Choose category");
      return;
    }
    step2.classList.add("hidden");
    step3.classList.remove("hidden");
  });

  /* ---------- PHOTO (iOS SAFE) ---------- */
  photoInput.addEventListener("change", e => {
    const file = e.target.files[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    photoBox.style.backgroundImage = `url(${url})`;
    photoBox.style.backgroundSize = "cover";
    photoBox.style.backgroundPosition = "center";
    photoBox.textContent = "";
  });

  /* ---------- FINISH ---------- */
  finishBtn.addEventListener("click", () => {
    alert("Registration completed");
  });

});