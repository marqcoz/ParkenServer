var admin = require('firebase-admin');

var serviceAccount = require('../parken-1520827408399-firebase-adminsdk-fpu48-e36c594626.json');



admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  //databaseURL: 'https://<DATABASE_NAME>.firebaseio.com'
  databaseURL: 'http://localhost:50546/'
});
