// js/quiz_selection.js
import { dbManager } from './indexedDB.js';

class QuizSelectionManager {
    constructor() {
        this.filters = {
            unit: '',
            topic: '',
            difficulty: '',
            tags: ''
        };
        this.init();
    }

    async init() {
        await this.checkAuthentication();
        this.setupEventListeners();
        await this.loadFilters();
        await this.loadQuizzes();
    }

    async checkAuthentication() {
        const session = await chrome.storage.local.get(['currentUser', 'isAuthenticated']);
        if (!session.isAuthenticated) {
            window.location.href = 'login.html';
            return;
        }
        document.getElementById('userName').textContent = session.currentUser.nickname;
    }

    setupEventListeners() {
        // Filter change events
        document.getElementById('unitFilter').addEventListener('change', () => this.handleFilterChange());
        document.getElementById('topicFilter').addEventListener('change', () => this.handleFilterChange());
        document.getElementById('difficultyFilter').addEventListener('change', () => this.handleFilterChange());
        document.getElementById('tagSearch').addEventListener('input', () => this.handleFilterChange());

        // Logout
        document.getElementById('logoutBtn').addEventListener('click', () => this.handleLogout());
    }

    async loadFilters() {
        try {
            const units = await dbManager.getDistinctValues('questions', 'unit');
            const topics = await dbManager.getDistinctValues('questions', 'topic');

            this.populateSelect('unitFilter', units);
            this.populateSelect('topicFilter', topics);
        } catch (error) {
            console.error('Error loading filters:', error);
        }
    }

    populateSelect(elementId, values) {
        const select = document.getElementById(elementId);
        values.forEach(value => {
            const option = document.createElement('option');
            option.value = value;
            option.textContent = value;
            select.appendChild(option);
        });
    }

    async handleFilterChange() {
        this.filters = {
            unit: document.getElementById('unitFilter').value,
            topic: document.getElementById('topicFilter').value,
            difficulty: document.getElementById('difficultyFilter').value,
            tags: document.getElementById('tagSearch').value
        };
        await this.loadQuizzes();
    }

    async loadQuizzes() {
        try {
            const quizzes = await this.getFilteredQuizzes();
            this.renderQuizList(quizzes);
        } catch (error) {
            console.error('Error loading quizzes:', error);
        }
    }

    async getFilteredQuizzes() {
        // Implement the filtering logic using IndexedDB
        // This is a simplified version - you'll need to implement the actual filtering
        return await dbManager.getQuizzes(this.filters);
    }

    renderQuizList(quizzes) {
        const quizList = document.getElementById('quizList');
        quizList.innerHTML = '';

        quizzes.forEach(quiz => {
            const card = this.createQuizCard(quiz);
            quizList.appendChild(card);
        });
    }

    createQuizCard(quiz) {
        const card = document.createElement('div');
        card.className = 'bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow';
        card.innerHTML = `
            <h3 class="text-lg font-semibold mb-2">${quiz.title}</h3>
            <div class="text-sm text-gray-600 mb-2">
                <div>Unit: ${quiz.unit}</div>
                <div>Topic: ${quiz.topic}</div>
                <div>Difficulty: ${quiz.level_of_difficulty}</div>
            </div>
            <div class="flex justify-between items-center mt-4">
                <div class="text-sm text-gray-500">${quiz.questionCount} questions</div>
                <button class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                        onclick="window.location.href='quiz.html?id=${quiz.id}'">
                    Start Quiz
                </button>
            </div>
        `;
        return card;
    }

    async handleLogout() {
        try {
            await chrome.storage.local.clear();
            window.location.href = 'login.html';
        } catch (error) {
            console.error('Error during logout:', error);
        }
    }
}

// Initialize quiz selection
new QuizSelectionManager();
