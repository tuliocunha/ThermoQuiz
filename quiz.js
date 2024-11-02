// js/quiz.js
import { dbManager } from './indexedDB.js';

class QuizManager {
    constructor() {
        this.questions = [];
        this.currentQuestionIndex = 0;
        this.userAnswers = [];
        this.timeLeft = 900; // 15 minutes in seconds
        this.timer = null;
        this.init();
    }

    async init() {
        await this.checkAuthentication();
        await this.loadQuizQuestions();
        this.setupEventListeners();
        this.startTimer();
        this.renderQuestion();
    }

    async checkAuthentication() {
        const session = await chrome.storage.local.get(['currentUser', 'isAuthenticated']);
        if (!session.isAuthenticated) {
            window.location.href = 'login.html';
            return;
        }
        this.userId = session.currentUser.id;
    }

    async loadQuizQuestions() {
        try {
            const urlParams = new URLSearchParams(window.location.search);
            const filters = {
                unit: urlParams.get('unit'),
                topic: urlParams.get('topic'),
                difficulty: urlParams.get('difficulty')
            };
            this.questions = await dbManager.getQuizQuestions(filters);
            document.getElementById('progress').textContent = 
                `Question 1/${this.questions.length}`;
        } catch (error) {
            console.error('Error loading questions:', error);
        }
    }

    setupEventListeners() {
        document.getElementById('prevButton').addEventListener('click', () => this.previousQuestion());
        document.getElementById('nextButton').addEventListener('click', () => this.nextQuestion());
        document.getElementById('finishButton').addEventListener('click', () => this.finishQuiz());
        document.getElementById('reviewButton').addEventListener('click', () => this.reviewQuiz());
    }

    startTimer() {
        this.timer = setInterval(() => {
            this.timeLeft--;
            this.updateTimerDisplay();
            if (this.timeLeft <= 0) {
                this.finishQuiz();
            }
        }, 1000);
    }

    updateTimerDisplay() {
        const minutes = Math.floor(this.timeLeft / 60);
        const seconds = this.timeLeft % 60;
        document.getElementById('timer').textContent = 
            `Time: ${minutes}:${seconds.toString().padStart(2, '0')}`;
    }

    renderQuestion() {
        const question = this.questions[this.currentQuestionIndex];
        document.getElementById('questionText').textContent = question.text;
        
        const optionsContainer = document.getElementById('options');
        optionsContainer.innerHTML = '';
        
        question.options.forEach((option, index) => {
            const button = document.createElement('button');
            button.className = `w-full text-left p-4 rounded border ${
