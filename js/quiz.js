let questions = [];
let currentQuestionIndex = -1;
let selectedQuestions = [];
let paused = false;

function loadQuestions() {
    readExcelFile('data/questions.xlsx', (data) => {
        questions = data.filter(question => 
            question.category_id === selectedCategoryId &&
            question.unit_id === selectedUnitId &&
            question.topic_id === selectedTopicId
        );
        startQuiz();
    });
}

function startQuiz() {
    if (questions.length === 0) {
        alert("No questions available for the selected criteria.");
        return;
    }
    nextQuestion();
}

function nextQuestion() {
    if (selectedQuestions.length === questions.length) {
        alert("Quiz completed!");
        return;
    }

    let randomIndex;
    do {
        randomIndex = Math.floor(Math.random() * questions.length);
    } while (selectedQuestions.includes(randomIndex));

    selectedQuestions.push(randomIndex);
    currentQuestionIndex = randomIndex;
    
    displayQuestion(questions[currentQuestionIndex]);
}

function displayQuestion(question) {
    document.getElementById('question-text').textContent = question.text;

    const imgElement = document.getElementById('question-image');
    if (question.id_image) {
        imgElement.src = `assets/question_images/${question.id_image}`;
        imgElement.style.display = 'block';
    } else {
        imgElement.style.display = 'none';
    }

    const alternativesDiv = document.getElementById('alternatives');
    alternativesDiv.innerHTML = ''; // Clear previous alternatives
    question.options.forEach((option) => {
        const button = document.createElement('button');
        button.textContent = option.text;
        button.onclick = () => checkAnswer(option.is_correct, question);
        alternativesDiv.appendChild(button);
    });

    // Reset feedback and tips
    document.getElementById('feedback').textContent = '';
    document.getElementById('tip-right').style.display = 'none';
    document.getElementById('comments').style.display = 'none';
    document.getElementById('next-button').style.display = 'none';
}

function checkAnswer(isCorrect, question) {
    const feedbackDiv = document.getElementById('feedback');
    if (isCorrect === 'yes') {
        feedbackDiv.textContent = "Correct!";
        showBadges(question.id_badges);
        document.getElementById('tip-right').textContent = question.tip_right;
        document.getElementById('tip-right').style.display = 'block';
        
        setTimeout(() => {
            // Show comments if available
            if (question.comments) {
                document.getElementById('comments').textContent = question.comments;
                document.getElementById('comments').style.display = 'block';
            }
            document.getElementById('next-button').style.display = 'block';
            flashNextButton();
        }, 1500); // Delay for tip_right
    } else {
        feedbackDiv.textContent = question.tp_wrong;
    }
}

function showBadges(badgeIds) {
    // Show badges in a popup
    badgeIds.forEach(badgeId => {
        const badgeElement = document.createElement('div');
        badgeElement.textContent = `Badge: ${badgeId}`;
        badgeElement.style.position = 'absolute';
        badgeElement.style.opacity = '0.8';
        // Randomly position badge
        badgeElement.style.top = `${Math.random() * 100}%`;
        badgeElement.style.left = `${Math.random() * 100}%`;
        document.body.appendChild(badgeElement);

        setTimeout(() => {
            document.body.removeChild(badgeElement);
        }, 2000);
    });
}

function flashNextButton() {
    const nextButton = document.getElementById('next-button');
    nextButton.style.animation = 'flash 1s infinite';
}

document.getElementById('next-button').onclick = () => {
    nextQuestion();
};

document.getElementById('back-button').onclick = () => {
    // Logic to return to the previous question (if needed)
    // This requires maintaining a history of selected questions
};

document.getElementById('pause-button').onclick = () => {
    paused = !paused;
    if (paused) {
        alert("Quiz paused. Press Play to continue.");
    }
};

document.getElementById('stop-button').onclick = () => {
    window.location.href = 'score.html'; // Navigate to score page
};

document.getElementById('exit-button').onclick = () => {
    document.getElementById('quiz-container').style.display = 'none';
    document.getElementById('settings-screen').style.display = 'block';
};

document.getElementById('play-button').onclick = () => {
    document.getElementById('settings-screen').style.display = 'none';
    document.getElementById('quiz-container').style.display = 'block';
};

document.getElementById('exit-settings').onclick = () => {
    // Logic to exit settings and return to main menu or previous screen
};

// Initialize the quiz
window.onload = () => {
    loadQuestions();
};
