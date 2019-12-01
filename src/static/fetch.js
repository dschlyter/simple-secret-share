function getSecret() {
    let path = window.location.href.split("#")[0].split("/");
    let secretId = path[path.length-1];
    let encryptionKey = window.location.href.split("#")[1]

    fetch('../api/secrets/'+secretId)
        .then(response => response.json())
        .then(responseData => {
            if (responseData.error) {
                displayFail();
            } else {
                return decrypt(responseData.secret, encryptionKey)
                    .then(cleartext => displaySecret(cleartext));
            }
        })
        .catch(e => alert("Error fetching secret "+e))
}

function displaySecret(secretText) {
    document.getElementById("fetch-pending").style.display = 'none';

    document.getElementById("secret-data").textContent = secretText;
    document.getElementById("fetch-success").style.display = 'block';

    // Reload after 15 minutes to clear secret text from browser
    setTimeout(function () {
        window.location.reload();
    }, 15 * 60 * 1000);
}

function displayFail() {
    document.getElementById("fetch-pending").style.display = 'none';
    document.getElementById("fetch-fail").style.display = 'block';
}

window.onload = function() {
    getSecret();
};
