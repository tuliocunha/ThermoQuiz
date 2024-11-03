function loadUnits() {
    const selectedCategoryId = document.getElementById('category-select').value;
    units.length = 0; // Clear previous units
    const unitSelect = document.getElementById('unit-select');
    unitSelect.innerHTML = '<option value="">-- Select a Unit --</option>'; // Reset options

    const filteredUnits = units.filter(unit => unit.category_id === selectedCategoryId);
    filteredUnits.forEach(unit => {
        const option = document.createElement('option');
        option.value = unit.id;
        option.textContent = unit.name;
        unitSelect.appendChild(option);
    });
}
