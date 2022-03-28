import {initializeApp} from 'firebase/app';
import {getFirestore} from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyBGMlFhEhfbDTYxMm2bJ61NbOAd8oppEz4",
    authDomain: "jsplayspace.firebaseapp.com",
    projectId: "jsplayspace",
    storageBucket: "jsplayspace.appspot.com",
    messagingSenderId: "383116386377",
    appId: "1:383116386377:web:ba1348a061d4d2f45e5f98"
};

//init app
const app = initializeApp(firebaseConfig);
console.log('app initialized');

//init services
const db = getFirestore(app);
console.log('db connected');

export {db as default};