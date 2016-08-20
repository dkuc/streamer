#!/usr/bin/env bash
npm install
tsc
browserify public/javascripts/main.js >  public/javascripts/bundle.js
