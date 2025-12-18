let currentLang = "en";
let selectedCategory = null;

/* STEP SWITCH */
const stepLang = document.getElementById("stepLang");
const step1 = document.getElementById("step1");
const step2 = document.getElementById("step2");
const step3 = document.getElementById("step3");

document.querySelectorAll(".lang").forEach(btn => {
  btn.onclick = () => {
    currentLang = btn.dataset.lang;
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
    document.querySelectorAll(".category").forEach(x =>
      x.classList.remove("selected")
    );
    c.classList.add("selected");
    selectedCategory = c.dataset.cat;
  };
});

next2.onclick = () => {
  if (!selectedCategory) {
    alert("Choose category");
    return;
  }
  step2.classList.add("hidden");
  step3.classList.remove("hidden");
};

/* PHOTO – iOS SAFE */
const photoInput = document.getElementById("photoInput");
const photoBox = document.getElementById("photoBox");

photoInput.onchange = e => {
  const file = e.target.files[0];
  if (!file) return;

  const url = URL.createObjectURL(file);
  photoBox.style.backgroundImage = `url(${url})`;
  photoBox.style.backgroundSize = "cover";
  photoBox.style.backgroundPosition = "center";
  photoBox.textContent = "";
};

/* FINISH */
finishBtn.onclick = () => {
  alert("Registration completed");
};