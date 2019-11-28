import binascii
import collections
import os
from datetime import datetime, timedelta
from typing import Dict

from flask import Flask, jsonify, request, render_template

app = Flask(__name__)


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

    secret_store[cryptographic_random_id] = Secret(data=secret, expires=datetime.now() + timedelta(days=1))

    return jsonify({'secret_id': cryptographic_random_id})


@app.route('/api/secrets/<secret_id>', methods=['GET'])
def store_get(secret_id):
    cleanup()
    secret = secret_store.get(secret_id)

    if secret:
        del secret_store[secret_id]

    return jsonify({
        'error': secret is None,
        'secret': secret.data if secret else None,
    })


def cleanup():
    global secret_store
    secret_store = {key: secret
                    for key, secret in secret_store.items()
                    if secret.expires >= datetime.now()}


# TODO cleanup on timer


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')
