import binascii
import collections
import os
import time
import threading
from datetime import datetime, timedelta
from typing import Dict

from flask import Flask, jsonify, request, render_template

app = Flask(__name__)

store_lock = threading.Lock()
Secret = collections.namedtuple('Secret', 'data expires')
secret_store: Dict[str, Secret] = {}


@app.route('/')
def index():
    return render_template("index.html")


@app.route('/secrets/<secret_id>')
def get(secret_id):
    # ignore secret_id. API request will fetch later
    return render_template("fetch.html")


@app.route('/api/secrets', methods=['POST'])
def store_post():
    secret = request.json.get('secret')

    if not secret:
        raise Exception("No secret found to store")

    cryptographic_random_id = binascii.b2a_hex(os.urandom(16)).decode('ascii')

    with store_lock:
        secret_store[cryptographic_random_id] = Secret(data=secret, expires=datetime.now() + timedelta(days=1))

    return jsonify({'secret_id': cryptographic_random_id})


@app.route('/api/secrets/<secret_id>', methods=['GET'])
def store_get(secret_id):
    with store_lock:
        secret = secret_store.get(secret_id)

    if secret:
        del secret_store[secret_id]

    return jsonify({
        'error': secret is None,
        'secret': secret.data if secret else None,
    })


def cleanup():
    with store_lock:
        secrets_before = len(secret_store)

        expired_keys = [key
                        for key, secret in secret_store.items()
                        if secret.expires < datetime.now()]
        for key in expired_keys:
            del secret_store[key]

        print("Cleanup done!",
              secrets_before - len(secret_store), "secrets removed,",
              len(secret_store), "secrets still in store")


def cleanup_thread():
    while True:
        time.sleep(15 * 60)
        cleanup()


if __name__ == '__main__':
    threading.Thread(target=cleanup_thread, daemon=True).start()
    app.run(debug=True, host='0.0.0.0')
