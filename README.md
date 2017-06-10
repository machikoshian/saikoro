# Requirements

* Typescript
* Node.js
* yarn
* webpack
* Google Firebase

* Google Cloud SDK (for deploy) 

# How to init the project

* npm install yarn --global
* npm install typescript --global
* npm link typescript
* npm install webpack --global
* npm install firebase-tools --global
* cd <Dir_of_this_README.md>
* yarn install

# How to build

* ./build.sh
* ./build_http.sh (for local http server)
* ./build_firebase.sh (for firebase only)
* ./build_standalone.sh (for local file)

# How to run in a local machine.

## Server
* node out/server/server.js

## Web browser
* open http://localhost:3156/

# How to deploy
* firebase deploy

* public/ is for Firebase hosting.
* functions/ is for Firebase functions.

# Coding style

* Basically this project follows https://github.com/Microsoft/TypeScript/wiki/Coding-guidelines
* Line width: 100 chars.
* Use "".
* Use ===, but not == except for comparisons with null/undefined.
  + GOOD: var1 === var2
  + GOOD: var1 == null
  + BAD: var1 == var2
  