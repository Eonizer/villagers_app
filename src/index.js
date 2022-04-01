import { auth, db, google_provider } from './fb.js'
import { toggleFavorites, addVillagers, getUserData, getVillagers } from './data_handler.js';
import { GoogleAuthProvider, onAuthStateChanged, signInWithRedirect, signInWithPopup, signOut} from 'firebase/auth';
import UI from './ui.js'
import Paginator from './paginator.js'
import { collection } from 'firebase/firestore';

import './styles/input.css';

const colRef = collection(db,'villagers');

const ui = new UI;
ui.init();

const loginBtn = ui.body.querySelector('#login-btn');
const logoutBtn = ui.body.querySelector('#logout-btn');

const nextPageBtn = ui.body.querySelector('#paginator .next-page');

const filterType = ui.body.querySelector('#filter-type');

let typeFilers = new Set;
let currentUser = null;
let userData = null;

//paginator
const paginatator = new Paginator(colRef, 'name', 50, ui);

// ui.loadVillagersFromLocal_btn.addEventListener('click', async () => {
//     const response = await fetch('./data.json');
//     const data = await response.json();
//     addVillagers(data)
//         .then(()=> console.log('finished loading'))
//         .catch(err => console.log(err.message));
// });

//auth
loginBtn.addEventListener('click', () => {
    
    console.log(auth, google_provider);
    signInWithPopup(auth, google_provider)
        .catch(err => {
            const errorMessage = err.message;
            const credential = GoogleAuthProvider.credentialFromError(err);
            console.log('Error signing in with Google: ', errorMessage, credential);
        });
});

logoutBtn.addEventListener('click', () => {
  signOut(auth)
    .catch(err => console.log(err));
});

onAuthStateChanged(auth, async user => {

    if (user){
      // User is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/firebase.User
      currentUser = user;
      console.log('user is signed in');

      paginatator.reset();
      ui.clearVillagers();

      await getUserData(currentUser)
        .then(d => userData = d)
        .catch(err => console.log(err));
      
    } else {
      // User is signed out
      // ...
      currentUser = null;
      userData = null;  

      paginatator.reset();
      ui.clearVillagers();

      console.log('user is not signed in');    
    }

    ui.updateAuthUI(currentUser);
    paginatator.getData();  

});

nextPageBtn.addEventListener('click', ()=>{
  paginatator.getData(() => ui.addClasses(nextPageBtn,'hidden'));
})

//filters
filterType.addEventListener('click', e => {
  console.log('click on: ', e.target);
  if(e.target.parentElement.tagName === 'BUTTON'){
    //console.log(e.target);
    paginatator.reset();
    ui.clearVillagers();
    toggleTypeFilter(e.target.parentElement);
  }
});

function toggleTypeFilter(btn){

  const type = btn.getAttribute('data-type');
  
  typeFilers.clear();
  typeFilers.add(type);
  //btn.classList.add('active');

  // if(typeFilers.has(type)){
  //   //typeFilers.delete(type); 
  //   btn.classList.remove('active');
  // } else {
  //   //typeFilers.add(type);
  //   btn.classList.add('active');
  // }
  
  console.log(typeFilers);
  
  paginatator.filter = Array.from(typeFilers);
  paginatator.getData(); 
} 

//favorites
ui.grid.addEventListener('click', e => {
    if(!currentUser){
      console.log('cant add to fav, login');
      return;
    }
    //console.log(e.target);
    if(e.target.classList.contains('fav-btn')){
      const inFavorites = e.target.parentElement.classList.contains('favorite');
      console.log(inFavorites);
      toggleFavorites(currentUser, e.target.parentElement.getAttribute('id'), inFavorites); 
    }
});

export {currentUser, userData};






