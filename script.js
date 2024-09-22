let inputDisplay = document.querySelector(".inputDisplay");
let autoClaculatedValueDisplayer = document.querySelector(
  ".autoClaculatedValueDisplayer"
);

let buttons = document.querySelectorAll(".buttonClass");

let currentEquation = "";
let equationLength = 0;
let isOpeningParenthesis = true;

let operatorsArray = ["+", "-", "*", "/", "%", "(", ")"];

buttons.forEach((button) => {
  let clickedValue = button.getAttribute("id");
  button.addEventListener("click", () => {
    buttonClickVibration();
    if (clickedValue === "=") {
      calculateValue();
    } else if (clickedValue === "idAllClear") {
      inputDisplay.value = "";
      currentEquation = "";
      equationLength = 0;
      autoClaculatedValueDisplayer.innerText = "";
    } else if (clickedValue === "delete") {
      currentEquation = currentEquation.slice(0, -1);
      inputDisplay.value = currentEquation;
      equationLength = currentEquation.length;

      if (equationLength === 0) {
        autoClaculatedValueDisplayer.innerText = "";
      } else if (equationLength >= 1) {
        autoCalculate();
      }
    } else {
      currentEquation += clickedValue;
      inputDisplay.value = currentEquation;
      equationLength++;

      inputDisplayToRight();

      if (operatorsArray.every((operator) => operator !== clickedValue)) {
        autoCalculate();
      }
    }
    displayInputSize();
  });
});

function displayInputSize() {
  if (equationLength <= 10) {
    inputDisplay.style.fontSize = "4em";
  } else if (equationLength === 11) {
    inputDisplay.style.fontSize = "3.5em";
  } else if (equationLength === 12) {
    inputDisplay.style.fontSize = "3.2em";
  } else if (equationLength === 13) {
    inputDisplay.style.fontSize = "2.9em";
  } else if (equationLength >= 14) {
    inputDisplay.style.fontSize = "2.6em";
  }
}

function calculateValue() {
  let equationsLastChar = currentEquation.charAt(currentEquation.length - 1);
  if (operatorsArray.every((operator) => operator !== equationsLastChar)) {
    try {
      currentEquation = eval(currentEquation);
      inputDisplay.value = currentEquation;
      autoClaculatedValueDisplayer.innerText = "";
    } catch (error) {
      resultErrorVibration();
      inputDisplay.value = "ERROR";
      autoClaculatedValueDisplayer.innerText = "";
      currentEquation = "";
    }
  } else {
    alert(`Equations last value cannot be ${equationsLastChar} `);
  }
}

function autoCalculate() {
  try {
    autoCalculatedEquation = eval(currentEquation);
    autoClaculatedValueDisplayer.innerText = autoCalculatedEquation;
  } catch (error) {
    console.log(error);
  }
}

// VIBRATION ON BUTTONCLICK FUNCTION
function buttonClickVibration() {
  if (navigator.vibrate) {
    navigator.vibrate(20);
  } else {
    alert("Vibration API not supported on this device.");
  }
}
// VIBRATION ON ERROR FUNCTION
function resultErrorVibration() {
  if (navigator.vibrate) {
    navigator.vibrate(300);
  } else {
    alert("Vibration API not supported on this device.");
  }
}

// BUTTONS HIDING FUNCTION
function hideButtonsFunction() {
  let buttonsCnt = document.querySelector(".buttonsContainer");
  buttonsCnt.classList.add("hideButtonsClass");
}
// BUTTONS UNHIDING FUNCTION
function showButtonsFunction() {
  let buttonsCnt = document.querySelector(".buttonsContainer");
  buttonsCnt.classList.remove("hideButtonsClass");
}

//Caching Code
const cacheName = "calculator-cache-v1";
const assetsToCache = [
  "/", // Root directory
  "/index.html", // Your HTML file
  "/styles.css", // Your CSS file
  "/script.js", // Your JavaScript file for the calculator
  // Add any other assets like icons, images if needed
];

// Install event - caches all assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(cacheName).then((cache) => {
      console.log("Caching assets");
      return cache.addAll(assetsToCache);
    })
  );
});

// Fetch event - serves cached assets when offline
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/service-worker.js")
      .then((reg) => {
        console.log("Service Worker registered:", reg.scope);
      })
      .catch((err) => {
        console.error("Service Worker registration failed:", err);
      });
  });
}
