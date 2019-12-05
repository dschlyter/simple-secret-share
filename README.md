Simple Secret Share
===================

This is a minimal implementation of a secret sharing webapp. 

The use case is sharing credentials in a more secure way than Slack, email, etc, 
and a more accessible way than GPG or other crypto solutions.

The code is minimal with 155 lines of javascript and 82 lines of python,
meaning that you can verify everything yourself.

Features
--------

* Client side crypto is utilized and the server never sees sensitive data.
* Secrets can only be fetched once and are cleaned up after 24 hours.
* Deployable wherever you deploy your docker images.

Setup
-----

    docker build -t simple-secret-share .
    docker run -p 5000:5000 simple-secret-share
    # replace docker run with whatever you use to deploy docker images

Caveats
-------

* [Web Crypto](https://developer.mozilla.org/en-US/docs/Web/API/Window/crypto) required so it might fail in old browsers.
* No TLS included, you need to deploy this behind some kind of proxy.
* The Docker image runs the dev-mode of Flask. This will not handle a large amount of traffic, but the intended use case is a very low volume of traffic.
* Secrets are stored in memory and will be lost on redeploy (or if Kubernetes moves your pod).
The intention is that this should be rare since secret should be consumed ASAP, and if it happens anyway the secret can be sent again.
