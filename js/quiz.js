const questions = [
    { question: "What does HVAC stand for?", answers: ["Heating, Ventilation, and Air Conditioning", "Heating, Ventilation, and Air Cooling"], correct: 0 },
    { question: "What is the purpose of a compressor?", answers: ["To cool air", "To circulate refrigerant"], correct: 1 }
];

let currentQuestion = 0;

function loadQuestion() {
    const questionText = document.getElementById("question-text");
    const answersDiv = document.getElementById("answers");
    questionText.textContent = questions[currentQuestion].question;
    answersDiv.innerHTML = '';
    questions[currentQuestion].answers.forEach((answer, index) => {
        const button = document.createElement('button');
        button.textContent = answer;
        button.onclick = () => selectAnswer(index);
        answersDiv.appendChild(button);
    });
}

function selectAnswer(index) {
    if (index === questions[currentQuestion].correct) {
        alert("Correct!");
    } else {
        alert("Wrong!");
    }
    currentQuestion++;
    if (currentQuestion < questions.length) {
        loadQuestion();
    } else {
        alert("Quiz finished!");
        // Save score and redirect to score page
        localStorage.setItem('score', currentQuestion); // Example score saving
        window.location.href = 'score.html';
    }
}

document.addEventListener("DOMContentLoaded", loadQuestion);
