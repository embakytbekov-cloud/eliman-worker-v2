document.addEventListener("DOMContentLoaded", () => {

  const stepLang = document.getElementById("stepLang");
  const step1 = document.getElementById("step1");
  const step2 = document.getElementById("step2");
  const step3 = document.getElementById("step3");

  let selectedLang = null;
  let selectedCategory = null;

  // LANGUAGE
  document.querySelectorAll(".lang").forEach(btn => {
    btn.onclick = () => {
      selectedLang = btn.dataset.lang;
      stepLang.classList.add("hidden");
      step1.classList.remove("hidden");
    };
  });

  // STEP 1
  document.getElementById("next1").onclick = () => {
    step1.classList.add("hidden");
    step2.classList.remove("hidden");
  };

  // CATEGORY
  document.querySelectorAll(".category").forEach(c => {
    c.onclick = () => {
      document.querySelectorAll(".category").forEach(x => x.classList.remove("selected"));
      c.classList.add("selected");
      selectedCategory = c.dataset.cat;
    };
  });

  document.getElementById("next2").onclick = () => {
    if (!selectedCategory) {
      alert("Choose category");
      return;
    }
    step2.classList.add("hidden");
    step3.classList.remove("hidden");
  };

  // PHOTO PREVIEW (iOS SAFE)
  const photoInput = document.getElementById("photoInput");
  const photoBox = document.getElementById("photoBox");

  photoInput.onchange = () => {
    const file = photoInput.files[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    photoBox.style.backgroundImage = `url(${url})`;
    photoBox.style.backgroundSize = "cover";
    photoBox.style.backgroundPosition = "center";
    photoBox.textContent = "";
  };

  // FINISH
  document.getElementById("finishBtn").onclick = () => {
    alert("Registration finished (demo)");
  };

});