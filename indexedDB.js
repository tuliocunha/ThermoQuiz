// js/indexedDB.js - Additional methods for DatabaseManager class

class DatabaseManager {
    // ... (previous code remains the same)

    async getDistinctValues(storeName, field) {
        const db = await this.initDB();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction([storeName], 'readonly');
            const store = transaction.objectStore(storeName);
            const request = store.getAll();

            request.onsuccess = () => {
                const values = [...new Set(request.result.map(item => item[field]))];
                resolve(values);
            };
            request.onerror = () => reject(request.error);
        });
    }

    async getQuizzes(filters) {
        const db = await this.initDB();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(['questions'], 'readonly');
            const store = transaction.objectStore('questions');
            const request = store.getAll();

            request.onsuccess = () => {
                let results = request.result;

                // Apply filters
                if (filters.unit) {
                    results = results.filter(q => q.unit === filters.unit);
                }
                if (filters.topic) {
                    results = results.filter(q => q.topic === filters.topic);
                }
                if (filters.difficulty) {
                    results = results.filter(q => q.level_of_difficulty === filters.difficulty);
                }
                if (filters.tags) {
                    const searchTags = filters.tags.toLowerCase().split(',').map(t => t.trim());
                    results = results.filter(q => 
                        q.tags.some(tag => searchTags.includes(tag.toLowerCase()))
                    );
                }

                resolve(results);
            };
            request.onerror = () => reject(request.error);
        });
    }

    async updateUserScore(userId, quizResult) {
        const db = await this.initDB();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(['scores'], 'readwrite');
            const store = transaction.objectStore('scores');
            
            const score = {
                user_id: userId,
                quiz_id: quizResult.quizId,
                score: quizResult.score,
                correct_answers: quizResult.correctAnswers,
                total_questions: quizResult.totalQuestions,
                time_taken: quizResult.timeTaken,
                date_played: new Date().toISOString()
            };

            const request = store.add(score);
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async getBadges(userId) {
        const db = await this.initDB();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(['badges'], 'readonly');
            const store = transaction.objectStore('badges');
            const request = store.getAll();

            request.onsuccess = () => {
                const badges = request.result.filter(badge => badge.user_id === userId);
                resolve(badges);
            };
            request.onerror = () => reject(request.error);
        });
    }

    async awardBadge(userId, badgeType) {
        const db = await this.initDB();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(['badges'], 'readwrite');
            const store = transaction.objectStore('badges');
            
            const badge = {
                user_id: userId,
                type: badgeType,
                date_awarded: new Date().toISOString(),
                awarded: true
            };

            const request = store.add(badge);
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async getQuizQuestions(filters, limit = 10) {
        const db = await this.initDB();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(['questions'], 'readonly');
            const store = transaction.objectStore('questions');
            const request = store.getAll();

            request.onsuccess = () => {
                let questions = request.result;
                
                // Apply filters
                if (filters) {
                    if (filters.unit) {
                        questions = questions.filter(q => q.unit === filters.unit);
                    }
                    if (filters.difficulty) {
                        questions = questions.filter(q => q.level_of_difficulty === filters.difficulty);
                    }
                    if (filters.topic) {
                        questions = questions.filter(q => q.topic === filters.topic);
                    }
                }

                // Randomize and limit
                questions = this.shuffleArray(questions).slice(0, limit);
                resolve(questions);
            };
            request.onerror = () => reject(request.error);
        });
    }

    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
}

export const dbManager = new DatabaseManager();
