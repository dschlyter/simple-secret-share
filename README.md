Simple Secret Share
===================

This is a minimal implementation of a secret sharing web app. 
A sender inputs a secret into the application, and is given a one-time link where the secret can be retrieved. 

The link to the secret can then be sent over a less secure channel like Slack or email, and is not exposed in the history afterwards.

The code is minimal with 155 lines of Javascript and 82 lines of python. 
This means that you can verify everything yourself in just a few minutes.

Features
--------

* Secret are encrypted and decrypted in the browser. Sensitive data is never exposed to the server or network.
* Secrets can only be retrieved once and are otherwise cleaned up after 24 hours.
* Deployable wherever you deploy your docker images.

Setup
-----

To run this locally.

    docker build -t simple-secret-share .
    docker run -p 5000:5000 simple-secret-share

To run in production. Replace `docker run` with whatever you use to deploy docker images.

Caveats
-------

* [Web Crypto](https://developer.mozilla.org/en-US/docs/Web/API/Window/crypto) required so it might fail in old browsers.
* No TLS included, you need to deploy this behind some kind of proxy.
* The Docker image runs the dev-mode of Flask. This will not handle a large amount of traffic, but the intended use case is a very low volume of traffic.
* Secrets are stored in memory and will be lost on redeploy (or if Kubernetes moves your pod).
The intention is that this should be rare since secret should be consumed ASAP, and when it happens the secret can be sent one more time.
