import {initializeApp} from 'firebase/app';
import {getFirestore, enableIndexedDbPersistence} from 'firebase/firestore';
import {getAuth, GoogleAuthProvider } from 'firebase/auth';
import {getStorage} from 'firebase/storage';

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
const storage = getStorage(app);

//cache db 
enableIndexedDbPersistence(db)
    .catch(err => {
        if (err.code == 'failed-precondition') {
            console.log('Multiple tabs open, persistence can only be enabled');
        } else if(err.code == 'unimplemented'){
            console.log('The current browser does not support all of the features required to enable persistence');
        }
    });

const google_provider = new GoogleAuthProvider();
const auth = getAuth(app);
auth.languageCode = 'ru';


console.log('auth connected');

export {db, auth, storage, google_provider};