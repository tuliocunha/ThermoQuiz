function startQuiz(quizType) {
    // Store the quiz type and redirect to quiz
    localStorage.setItem('quizType', quizType);
    window.location.href = 'quiz.html';
}
