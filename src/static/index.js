function storeSecret() {
    let secret = document.getElementById("entry").value;

    encrypt(secret)
        .then(([ivAndCiphertext, encryptionKey]) => {
            uploadSecret(ivAndCiphertext)
                .then(secretId => displayUrl(secretId, encryptionKey))
        })
        .catch(e => {
            console.error("Error uploading: " + e);
            alert("Error uploading: " + e);
        })
}


function uploadSecret(secret) {
    return fetch('api/secrets', {
        method: 'POST',
        body: JSON.stringify({secret}),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(response => response.json())
        .then(responseData => responseData['secret_id']);
}

function displayUrl(secretId, encryptionKey) {
    // The hash part of the url with the encryption key is never exposed to the server
    let url = window.location + "secrets/" + secretId + "#" + encryptionKey;

    document.getElementById("secret-url").textContent = url;

    document.getElementById("secret-entry").style.display = 'none';
    document.getElementById("secret-stored").style.display = 'block';
}

function generatePassword() {
    let prevValue = document.getElementById("entry").value;
    let newValue = buf2hex(randomBytes(24));
    if (prevValue.length > 0) {
        newValue = prevValue + "\n" + newValue;
    }
    document.getElementById("entry").value = newValue;
}
