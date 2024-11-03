document.getElementById("loginForm").addEventListener("submit", function(event) {
    event.preventDefault();
    
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    
    // Function to read the Excel file and validate credentials
    function validateCredentials() {
        const reader = new FileReader();
        reader.onload = function(event) {
            const data = new Uint8Array(event.target.result);
            const workbook = XLSX.read(data, {type: 'array'});
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const json = XLSX.utils.sheet_to_json(worksheet);

            const user = json.find(user => user.username === username && user.password === password);
            if (user) {
                window.location.href = "dashboard.html";
            } else {
                alert("Invalid username or password.");
            }
        };
        reader.onerror = function() {
            alert("Error reading the Excel file.");
        };
        reader.readAsArrayBuffer("data/users.xlsx"); // Ensure this path is correct
    }

    validateCredentials();
});
