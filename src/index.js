import './data_handler.js';
import UI from './ui.js'
import { addVillagers, getVillagers } from './data_handler.js';
import {auth, google_provider} from './fb.js'
import { GoogleAuthProvider, signInWithRedirect } from 'firebase/auth';

const ui = new UI;
ui.init();

ui.loadVillagersFromLocal_btn.addEventListener('click', async () => {
    const response = await fetch('./data.json');
    const data = await response.json();
    addVillagers(data)
        .then(()=> console.log('finished loading'))
        .catch(err => console.log(err.message));
});

const gAuthBtn = ui.addElement(ui.body.querySelector('.command-panel'), 'gAuth ' + ui.btnStyle, 'Sign in with Google','button');
gAuthBtn.addEventListener('click', () => {
    
    console.log(auth, google_provider);
    signInWithRedirect(auth, google_provider)
        .then(result => {
            const creds = GoogleAuthProvider.credentialFromResult(result);
            const token = creds.accessToken;
            const user = result.user;
            console.log('Signed in with Google: ', user, token);
        })
        .catch(err => {
            // Handle Errors here.
            // const errorCode = err.code;
            const errorMessage = err.message;
            // The email of the user's account used.
            // const email = err.email;
            // The AuthCredential type that was used.
            const credential = GoogleAuthProvider.credentialFromError(err);
            console.log('Error signing in with Google: ', errorMessage, credential);
        });
});

getVillagers().then(villagers => ui.renderVillagers(villagers));






