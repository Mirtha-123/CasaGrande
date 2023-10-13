/*importScripts('https://www.gstatic.com/firebasejs/7.6.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/7.6.0/firebase-messaging.js');
  firebase.initializeApp({
    apiKey: "AIzaSyApNIXRO2Rlj0PLL-EO2PiTBp9ycaqOScw",
  authDomain: "casagrande-f28fc.firebaseapp.com",
  databaseURL: "https://casagrande-f28fc.firebaseio.com",
  projectId: "casagrande-f28fc",
  storageBucket: "casagrande-f28fc.appspot.com",
  messagingSenderId: "212705004072",
  appId: "1:212705004072:web:08f2b55fb242593c74c31d",
  measurementId: "G-E19Z66S6BJ"
   
}).then(function (token) {
      console.log(token)

    })
    .catch(function(err) {
      console.log('Unable to get permission to notify.', err);
    });
    
  const messaging = firebase.messaging();*/
  importScripts('https://www.gstatic.com/firebasejs/7.7.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/7.7.0/firebase-messaging.js');
  firebase.initializeApp({
  apiKey: "AIzaSyBTXGb1FQvmtAKzhEg5g_eX2YLSBmBUeKI",
    authDomain: "erp-casa.firebaseapp.com",
    databaseURL: "https://erp-casa.firebaseio.com",
    projectId: "erp-casa",
    storageBucket: "erp-casa.appspot.com",
    messagingSenderId: "1073170149403",
    appId: "1:1073170149403:web:0422ad08a1c072cb7648be",
    measurementId: "G-HRND5FZQSY"
});
  const messaging = firebase.messaging();