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
    <title>Mobile performance challenge</title>
    <style>
      body, html {
        margin: 0;
        padding: 0;
        font-family:Roboto, sans-serif;
      }
      input:-webkit-autofill {
          -webkit-box-shadow: 0 0 0px 1000px white inset;
      }
      
      #root {
        min-height: calc(100vh - 30px);
      }
      
      .footer {
        height: 30px;
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
      }
      
      .card {
          max-width: 960px;
          width: 95vw;
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
      .result-content-text {
          margin-bottom: 15px;
          font-size: 2em;
      }
      .input-content {
        display: flex;
        align-items: baseline;
        justify-content: center;
        margin-bottom: 20px;
      }
    </style>
  </head>
  <body>
    <div id="root">`;

const end = `</div>
<script>
  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

  ga('create', 'UA-86964181-1', 'auto');
  ga('send', 'pageview');

</script>
  </body>
</html>`;

const content = ReactDOMServer.renderToString(<App firebase={firebase} />);

fs.writeFileSync(path.join(__dirname, 'public', 'index.html'), `${start}${content}${end}`);