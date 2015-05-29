# cj-client
fully-compliant Collection+JSON client 

NOTES:
 - uses no external libs/frameworks
 - built/tested for chrome browser (YMMV on other browsers)
 - designed to act as a "validator" for a human-driven Cj client.
 - not production robust (missing error-handling, perf-tweaking, etc.)
 - report issues to https://github.com/collection-json/cj-client

_IMPORTANT_
The folder `files` contains the _cj-client_ assets:
 - `cj-client.html`
 - `cj-client.js`
 - `cj-client.css`

The remaining files in the repo are the sample _server_ that produces Cj responses. You can use the client files as a stand-alone app and point that client to any Cj-compliant API server.

I included the server to provide a bootstrap example for the client and also to allow devs to use a local instance of a Cj server when mod-ing the client app.

@mamund

