# Miden Assembly Playground

Playground for Stark-based VM [Miden's](https://github.com/maticnetwork/miden) assembly language

[Try it out on Github Pages!](https://tohrnii.github.io/miden-game-of-life)

## Prerequisites

Install [wasm-pack](https://rustwasm.github.io/wasm-pack/installer/)

## Starting site

In the project directory, you can run:

`npm install && npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

Test rust code:

`cd miden-wasm && wasm-pack test --node`

Build production release:

`npm run build`

Credits:

GOL miden assembly source: https://gist.github.com/Dominik1999/fd606a13bcf09df787b53a6e8791bf4b

Bootstrapped using https://github.com/timgestson/miden-assembly-playground