# Summary

This is a pure js and html to show how oauth code flow + pkce works

## Prereq
* you should have a good understand of oauth code flow + pkce
* a idp (okta) with oauth + code flow + pkce client app configures
* update app.js configure to reflect your app
* index.html returns the code and exchange for a token
* lp.html passes code + code_verifier to LP for auth messaging

## Steps
* git clone this project in vscode
* update config to reflect your okta client app using pkce
* use live server extension to serve index.html
* access index.html to see the code and access token
* once you verify it, then you can move on the lp integration
* TODO: update code redirect to lp.html so lp can send code to its js callback

> use Developer Tools > Settings labelled "Console: Preserve log on navigation". to see the logs