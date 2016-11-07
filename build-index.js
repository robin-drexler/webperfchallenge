#!/bin/env node

const React = require('react');
const ReactDOMServer = require('react-dom/server');
import App from './src/App';
import firebase from 'firebase';
const path = require('path');
const fs = require('fs');

const config = {
    apiKey: "AIzaSyDJTcHWR87skx2hnXaqku50ZO0LKYEGpc4",
    authDomain: "pagespeed-51d5f.firebaseapp.com",
    databaseURL: "https://pagespeed-51d5f.firebaseio.com",
    storageBucket: "pagespeed-51d5f.appspot.com",
    messagingSenderId: "615133544374"
};
firebase.initializeApp(config);
const start = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>How slow is your site on mobile?</title>
    <style>
      body, html {
        margin: 0;
        padding: 0;
        font-family:Roboto, sans-serif;
      }
      input:-webkit-autofill {
          -webkit-box-shadow: 0 0 0px 1000px white inset;
      }

      .overview {
          margin:15px;
      }

      .form {
          margin-top: 24px;
          transition: opacity 0.5s linear;
          text-align: center;
      }

      .form.score-leave{
          opacity: 1;
      }

      .form.score-leave.score-leave-active {
          opacity: 0;
      }

      .url-input {
          margin-right: 24px;
      }

      .result {
          transition: opacity 0.5s linear;
          max-width: 960px;
          margin: 24px auto;
      }

      .result.score-enter-active {
          opacity: 1;
      }
      .result.score-enter {
          opacity: 0;
          position: absolute;
      }

      .result-description {
          margin-bottom: 24px;
      }
            * {
          box-sizing: border-box;
      }
      .result-content {
          display: flex;
          justify-content: space-between;
          flex-wrap: wrap;
      }
      .result-content-text {
          margin-bottom: 10px;
      }
      .app-bar-link {
        text-decoration: none;
      }
    </style>
  </head>
  <body>
    <div id="root">`;

const end = `</div>
  </body>
</html>`;

const content = ReactDOMServer.renderToString(<App firebase={firebase} />);

fs.writeFileSync(path.join(__dirname, 'public', 'index.html'), `${start}${content}${end}`);