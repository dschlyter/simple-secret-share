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
    document.getElementById("entry").value = buf2hex(randomBytes(24));
}

// After user input hide the password button in order to avoid user confusing password generation in a secret with protecting their secret with a password
document.getElementById("entry").addEventListener('keydown', (event) => {
    document.getElementById("generate-button").style.display = 'none';
});
