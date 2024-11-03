let translations = {};
let currentLanguage = 'en'; // Default language

function loadTranslations() {
    readExcelFile('data/quiz_translation.xlsx', (data) => {
        data.forEach(row => {
            translations[row.id] = {
                en: row.en,
                es: row.es,
                por: row.por
            };
        });
        updateUI();
    });
}

function changeLanguage(lang) {
    currentLanguage = lang;
    updateUI();
}

function updateUI() {
    document.getElementById('quiz-selection-header').textContent = translations['title'][currentLanguage];
    document.getElementById('category-label').textContent = translations['category_label'][currentLanguage];
    document.getElementById('unit-label').textContent = translations['unit_label'][currentLanguage];
    document.getElementById('topic-label').textContent = translations['topic_label'][currentLanguage];
    document.getElementById('start-quiz').textContent = translations['start_quiz'][currentLanguage];
}
