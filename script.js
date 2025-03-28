const currentExpressionContainer = document.querySelector(
  ".currentExpressionContainer"
);
const resultContainer = document.querySelector(".resultContainer");
const buttons = document.querySelectorAll(".button");
//
const operatorsArray = ["+", "-", "*", "/", "×", "÷"];
//
//
let addToHistory = false;
buttons.forEach((button) => {
  button.addEventListener("click", () => {
    let clickedInput = button.getAttribute("data-value");
    resultContainer.innerText = "";
    if (navigator) {
      navigator.vibrate(15);
    }
    if (clickedInput == "=") {
      evalCurrentExpression();
      if (addToHistory === true) {
        pushIntoHistoryArray();
        addToHistory = false;
        checkHistory();
      }
    } else if (clickedInput == "AC") {
      clearCalculator();
    } else if (clickedInput == "DEL") {
      addToHistory = true;
      currentExpressionContainer.value = currentExpressionContainer.value.slice(
        0,
        -1
      );
    } else if (clickedInput === "(" || clickedInput === ")") {
      handleParentheses();
    } else {
      addToHistory = true;
      let lastClickedInput = currentExpressionContainer.value.slice(-1);
      if (operatorsArray.includes(clickedInput)) {
        if (operatorsArray.includes(lastClickedInput)) {
          currentExpressionContainer.value =
            currentExpressionContainer.value.slice(0, -1) + clickedInput;
        } else {
          currentExpressionContainer.value += clickedInput;
        }
      } else {
        currentExpressionContainer.value += clickedInput;
      }
    }
    //
    //
    //
    currentExpressionContainer.scrollLeft =
      currentExpressionContainer.scrollWidth;
    //
    //
    //
  });
});
//
function evalCurrentExpression() {
  let evaluableExpression = currentExpressionContainer.value;
  evaluableExpression = evaluableExpression.replace(/\.{2,}/g, "."); // To remove if more than one dot is present in the equation
  currentExpressionContainer.value = evaluableExpression;
  evaluableExpression = evaluableExpression.replace(/×/g, "*");
  evaluableExpression = evaluableExpression.replace(/÷/g, "/");
  evaluableExpression = evaluableExpression.replace(/(\d)\(/g, "$1*(");
  evaluableExpression = evaluableExpression.replace(/\)(\d)/g, ")*$1");

  //
  operatorsArray.forEach((operator) => {
    while (
      evaluableExpression.slice(-1) === operator ||
      evaluableExpression.slice(-1) === "."
    ) {
      evaluableExpression = evaluableExpression.slice(0, -1);
      currentExpressionContainer.value = evaluableExpression;
    }
  });
  //
  //
  try {
    result = eval(evaluableExpression);
    if (!isFinite(result)) throw "Math Error"; // Handle division by zero
    if (result % 1 !== 0) {
      result = result.toFixed(2);
    }
    resultContainer.innerText = result;
  } catch (error) {
    resultContainer.innerText = error;
  }

  resultContainer.scrollLeft = resultContainer.scrollWidth;
  //
}
//
function updateTextInsideButtons() {
  buttons.forEach((button) => {
    let text = button.getAttribute("data-value");
    button.innerText = text;
  });
}
updateTextInsideButtons();
//
function handleParentheses() {
  let expression = currentExpressionContainer.value;
  let lastChar = expression.slice(-1);
  let parenthesesButton = document.querySelector(".parenthesesButton");

  let openCount = (expression.match(/\(/g) || []).length;
  let closeCount = (expression.match(/\)/g) || []).length;

  if (
    openCount > closeCount &&
    lastChar !== "(" &&
    !operatorsArray.includes(lastChar)
  ) {
    // If more '(' than ')', and last char is not '(', close it.
    currentExpressionContainer.value += ")";
    updateParenthesesButton("(");
  } else {
    // Otherwise, open a new '('
    if (
      expression.length === 0 ||
      operatorsArray.includes(lastChar) ||
      lastChar === "("
    ) {
      currentExpressionContainer.value += "(";
    } else {
      // Insert implicit multiplication if needed (e.g., 2(3) → 2 × (3))
      currentExpressionContainer.value += "×(";
    }
    updateParenthesesButton(")");
  }
}
function updateParenthesesButton(newValue) {
  let parenthesesButton = document.querySelector(".parenthesesButton");
  parenthesesButton.setAttribute("data-value", newValue);
  parenthesesButton.innerText = newValue;
}
function clearCalculator() {
  currentExpressionContainer.value = "";
  resultContainer.innerText = "";
  updateParenthesesButton("(");
}
function pushIntoHistoryArray() {
  let expression = currentExpressionContainer.value;
  let result = resultContainer.innerText;

  // Convert result to a number
  let numericResult = Number(result);

  // Retrieve existing history from localStorage or initialize an empty array
  let historyArray = JSON.parse(localStorage.getItem("historyArray")) || [];

  // Prevent saving errors (like "Math Error", "Syntax Error") and invalid numbers
  if (
    !isNaN(numericResult) &&
    isFinite(numericResult) &&
    result !== "Math Error" &&
    result !== "Syntax Error"
  ) {
    historyArray.push({ expression, result });

    // Save updated history to localStorage
    localStorage.setItem("historyArray", JSON.stringify(historyArray));
  }
}
//
//
//
//
//
//
//
const historySection = document.querySelector(".historySection"); // Make sure this is the correct selector
function updateHistoryContainer() {
  //
  //
  let historyArray = JSON.parse(localStorage.getItem("historyArray")) || [];
  //
  //
  let historyContainer = document.querySelector(".historyContainer");
  historyContainer.innerHTML = ""; // Clear previous history to avoid duplicates
  //
  //
  historyArray.forEach(({ expression, result }) => {
    let historyDiv = document.createElement("div");
    historyDiv.classList.add("historyDiv");

    let historyExpression = document.createElement("div");
    historyExpression.classList.add("historyExpression");
    historyExpression.innerText = expression;

    let historyResult = document.createElement("div");
    historyResult.classList.add("historyResult"); // Fixed class issue
    historyResult.innerText = `= ${result}`;

    historyDiv.append(historyExpression, historyResult);
    historyContainer.prepend(historyDiv);
  });
}
let historyIcon = document.querySelector(".historyIcon");
historyIcon.addEventListener("click", toggleHistoryBar);
function toggleHistoryBar() {
  if (historySection.classList.contains("historySectionActive")) {
    historySection.classList.remove("historySectionActive");
  } else {
    updateHistoryContainer(); // Ensure history is updated before showing
    historySection.classList.add("historySectionActive");
  }
}
document
  .querySelector(".closeHistoryCnt")
  .addEventListener("click", toggleHistoryBar);

document.addEventListener("DOMContentLoaded", function () {
  if (window.innerWidth >= 720) {
    toggleHistoryBar();
    let equalToBtn = document.querySelectorAll(".operatorButton");
    equalToBtn.forEach((btn) => {
      if (btn.innerText == "=") {
        btn.addEventListener("click", () => {
          updateHistoryContainer();
        });
      }
    });
  }
});

function checkHistory() {
  const historyContainer = document.querySelector(".historyContainer"); // Ensure this matches your HTML

  // Check if "historyArray" key exists in localStorage
  if (!localStorage.getItem("historyArray")) {
    historyContainer.innerHTML =
      "<div class='no-historyClass'><h1>Start calculating to see history here</h1></div>";
    document.querySelector(".clearHistoryCnt").style.display = "none";
  } else {
    document.querySelector(".clearHistoryCnt").style.display = "";
  }
}
// Run function when page loads
document.addEventListener("DOMContentLoaded", checkHistory);

document.querySelector(".clearHistoryCnt").addEventListener("click", () => {
  document.querySelectorAll(".historyDiv").forEach((div) => {
    div.style.transition = `.3s ease`;
    div.style.transform = `scale(0)`;
  });
  setTimeout(() => {
    localStorage.clear();
    updateHistoryContainer();
    if (window.innerWidth < 720) {
      toggleHistoryBar();
    }
    checkHistory();
  }, 300);
});
