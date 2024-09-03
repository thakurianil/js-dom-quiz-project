const frontPage = document.querySelector(".frontpage");
const quizPage = document.querySelector(".quizpage");
const resultPage = document.querySelector(".result");

const nextpage = (e) => {
  if (e == "home") {
    frontPage.style.visibility = "hidden";
    quizPage.setAttribute("style", "visibility: visible ; margin: -5cm");
  }
  if (e == "quiz") {
    resultPage.setAttribute("style", "visibility: visible ; margin: -10cm;");
    quizPage.style.visibility = "hidden";
  }
  if (e == "restart") {
    frontPage.style.visibility = "visible";
    resultPage.style.visibility = "hidden";
  }
};

document.addEventListener("DOMContentLoaded", () => {
  async function loadQuiz() {
    try {
      const response = await fetch("question.json");
      const data = await response.json();
      displayQuestions(data);
    } catch (error) {
      console.error("Error fetching the JSON file:", error);
    }
  }

  function displayQuestions(questions) {
    const quizContainer = document.getElementById("quiz-container");

    questions.forEach((question, index) => {
      const questionElement = document.createElement("div");
      questionElement.classList.add("question-container");

      const questionTitle = document.createElement("h6");
      questionTitle.textContent = `Question ${index + 1}: ${question.question}`;
      questionElement.appendChild(questionTitle);

      question.options.forEach((option, i) => {
        const optionElement = document.createElement("div");
        optionElement.classList.add("option");

        const optionInput = document.createElement("input");
        optionInput.type = "radio";
        optionInput.name = `question${index + 1}`;
        
        optionInput.value = option;
        optionInput.id = `question${index}-${option}`;
        
        const optionLabel = document.createElement("label");
        optionLabel.textContent = option;
        optionLabel.setAttribute("style", "font-size: 20px;");
        optionElement.appendChild(optionInput);
        optionElement.appendChild(optionLabel);
        questionElement.appendChild(optionElement);
      });

      quizContainer.appendChild(questionElement);
    });
  }

  function getSelectedValues() {
    const form = document.querySelector("#quizsubmitted");
    const formData = new FormData(form);
    
    const results = {};

    formData.forEach((value, key) => {
      results[key] = value;
    });

    return results;
  }
  function calculateAnswer(answer) {
    fetch("question.json")
      .then((response) => response.json())
      .then((data) => {
        let score =0;
        data.forEach((question, index) => {
            if (answer[`question${index + 1}`] === question.answer) {
              score++;
            }
          });
          console.log(score);
        document.querySelector(".result").textContent = `Your score is ${score} out of ${data.length}`;
          
      })
      .catch((error) => console.error("Error:", error));
  }

  document
    .getElementById("quizsubmitted")
    .addEventListener("submit", (event) => {
      event.preventDefault(); 

      const selectedValues = getSelectedValues();
        calculateAnswer(selectedValues);

    });
  loadQuiz();
});
