import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import firebase from 'firebase';

if (navigator.userAgent.indexOf('Google Page Speed Insights') === -1) {
    const config = {
        apiKey: "AIzaSyDJTcHWR87skx2hnXaqku50ZO0LKYEGpc4",
        authDomain: "pagespeed-51d5f.firebaseapp.com",
        databaseURL: "https://pagespeed-51d5f.firebaseio.com",
        storageBucket: "pagespeed-51d5f.appspot.com",
        messagingSenderId: "615133544374"
    };
    firebase.initializeApp(config);

    ReactDOM.render(
      <App firebase={firebase} />,
      document.getElementById('root')
    );
}