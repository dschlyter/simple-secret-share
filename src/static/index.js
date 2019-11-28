function storeSecret() {
    var secret = document.getElementById("entry").value;
    console.log(secret);

    fetch('api/secrets', {
        method: 'POST',
        body: JSON.stringify({secret}),
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => response.json())
        .then(responseData => {
            var url = window.location + "secrets/" + responseData["secret_id"];
            document.getElementById("secret-url").innerText = url;

            document.getElementById("secret-entry").style.display = 'none';
            document.getElementById("secret-stored").style.display = 'block';
        })
        .catch(e => alert("Error posting secret "+e))
}

function encrypt() {

}
