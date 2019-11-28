Simple Secret Share
===================

This is a minimal implementation of a secret sharing webapp. 

The use case is sharing credentials in a more secure way than Slack, email, etc, 
and a more accessible way than GPG or other crypto solutions.

The code is minimal

Features
--------

* Client side crypto is utilized and the server never sees sensitive data
* Secrets can only be fetched once and are cleaned up after 24 hours

Caveats
-------

* No TLS, you need to deploy this behind some kind of proxy.
* [Web Crypto](https://developer.mozilla.org/en-US/docs/Web/API/Window/crypto) required so might 
fail in old browsers.
