function get_secret() {
    var path = window.location.href.split("#")[0].split("/");
    var secretId = path[path.length-1];

    fetch('../api/secrets/'+secretId)
        .then(response => response.json())
        .then(responseData => {
            document.getElementById("fetch-pending").style.display = 'none';

            if (!responseData.error) {
                document.getElementById("secret-data").innerText = responseData.secret;
                document.getElementById("fetch-success").style.display = 'block';

                // Reload after 15 minutes to clear secret text from browser
                setTimeout(function () {
                    window.location.reload();
                }, 15 * 60 * 1000);
            } else {
                document.getElementById("fetch-fail").style.display = 'block';
            }
        })
        .catch(e => alert("Error fetching secret "+e))
}

function decrypt(secret_data, key) {

}

get_secret();
