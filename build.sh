#!/usr/bin/env bash
#rm -rf node_modules/
npm install
tsc
browserify public/javascripts/main.js >  public/javascripts/bundle.js
