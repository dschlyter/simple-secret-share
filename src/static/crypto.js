const crypto = window.crypto || window.msCrypto; // for IE 11

const ALGO = "AES-GCM";

/**
 * @param plaintext the plaintext to encrypt
 * @returns a promise with encrypted text and a generated encryption key as hex strings
 */
function encrypt(plaintext) {
    // Encrypt docs here https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/encrypt
    // Welcome to callback hell :( Proudly sponsored by IE11 support.

    let keyPromise = crypto.subtle.generateKey({name: ALGO, length: 256}, true, ["encrypt", "decrypt"]);
    return keyPromise.then(key => {
        let encoded = new TextEncoder().encode(plaintext);
        let iv = randomBytes(16);
        console.log("before", iv, encoded);
        let encryptPromise = crypto.subtle.encrypt({name: ALGO, iv: iv}, key, encoded);
        console.log("Key", key);
        return encryptPromise.then(ciphertext => {
            return crypto.subtle.exportKey("raw", key)
                .then(exportedKey => [buf2hex(iv) + "," + buf2hex(ciphertext), buf2hex(exportedKey)])
        });
    });
}

function randomBytes(numberOfBytes) {
    return crypto.getRandomValues(new Uint8Array(numberOfBytes));
}

/**
 * @param ivAndCiphertext iv and ciphertext in hex separated by comma
 * @param decryptionKey key in hex
 * @returns a promise with the clear text
 */
function decrypt(ivAndCiphertext, decryptionKey) {
    console.log("decrypting", ivAndCiphertext, decryptionKey);
    let parts = ivAndCiphertext.split(",");
    let iv = hex2buf(parts[0]);
    let ciphertext = hex2buf(parts[1]);
    let keyBuffer = hex2buf(decryptionKey);
    console.log("after", iv, ciphertext);

    return crypto.subtle.importKey("raw", keyBuffer, {name: ALGO}, true, ["encrypt", "decrypt"]).then(
        importedKey => {
            console.log("imported!", importedKey);
            return window.crypto.subtle.decrypt({name: ALGO, iv: iv}, importedKey, ciphertext)
                .then(decrypted => {
                    console.log("wat!?!?", decrypted);
                    return new TextDecoder("utf-8").decode(decrypted)
                })
        }
    );
}

// Credit: https://stackoverflow.com/questions/40031688/javascript-arraybuffer-to-hex/40031979
function buf2hex(arrayBuffer) {
    let buffer = new Uint8Array(arrayBuffer);

    let ret = "";
    for (let i=0; i<buffer.length; i++) {
        ret += ("0" + buffer[i].toString(16)).slice(-2);
    }

    return ret;
}

function hex2buf(hex) {
    let ret = [];
    for (let i=0; i<hex.length; i+=2) {
        ret.push(parseInt(hex.substr(i, 2), 16));
    }

    console.log(ret);
    return new Uint8Array(ret);
}