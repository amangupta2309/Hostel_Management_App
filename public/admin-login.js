
document.getElementById("adminLoginForm").addEventListener('submit', function(event){
    event.preventDefault();

    const formData = new FormData(event.target);
    console.log(formData);

    // Send a POST request to the server
    fetch('/auth/login', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json()) // assuming the server responds with JSON
    .then(data => {
        // Handle the response from the server
        console.log(data);
    })
    .catch(error => {
        console.error('Error:', error);
    });
})