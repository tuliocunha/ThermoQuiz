function loadTopics() {
    const selectedUnitId = document.getElementById('unit-select').value;
    topics.length = 0; // Clear previous topics
    const topicSelect = document.getElementById('topic-select');
    topicSelect.innerHTML = '<option value="">-- Select a Topic --</option>'; // Reset options

    const filteredTopics = topics.filter(topic => topic.unit_id === selectedUnitId);
    filteredTopics.forEach(topic => {
        const option = document.createElement('option');
        option.value = topic.id;
        option.textContent = topic.name;
        topicSelect.appendChild(option);
    });

    // Enable the start quiz button if a topic is selected
    document.getElementById('start-quiz').disabled = !selectedUnitId;
}
