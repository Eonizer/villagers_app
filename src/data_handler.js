import { onSnapshot, collection, addDoc, Timestamp, getDocs, query, orderBy, limit, doc, getDoc, setDoc, updateDoc, arrayUnion, increment, arrayRemove } from '@firebase/firestore';
import {db} from './fb.js';
import { userData } from './index.js';

const colRef = collection(db, 'villagers');
let unsubArray = [];

async function addVillagers(villagers){
    return new Promise((resolve, reject) => {
        villagers.forEach(villager => {
            villager.birthday = Date.parse(villager.birthday);
            if(isNaN(villager.birthday)){
                console.log('cant parse to timestamp, set the birthday to now:', villager);
                villager.birthday = new Date();
            }

            villager.birthday = Timestamp.fromMillis(villager.birthday);

            addDoc(colRef, villager)
                .catch(err => {
                    console.log('cant add villager: ', err.message);
                    reject(err, villager);
                });
        });
        resolve(true);
    });
}

async function getVillagers(query, callback){
        
    //let villagers = [];

    // //const q = query(colRef,orderBy('name'),limit(count));       
    // const qSnapshot = await getDocs(query);


    // let currentDoc = null;
    // for (let index = 0; index < qSnapshot.size; index++) {
    //     currentDoc = qSnapshot.docs[index];
        
    //     let rdoc = currentDoc.data();
    //     villagers.push(rdoc);
    //     rdoc.id = currentDoc.id;
    // }

    const unsub = onSnapshot(query, snapshot => {
        
        let currentDoc = null;

        let attachUserData = false;
        if(userData && userData.favVillagers){
            // console.log(userData.favVillagers);  
            attachUserData = true;
        }

        snapshot.docChanges().forEach(change => {
            const docData = change.doc.data();
            docData.id = change.doc.id;
            docData.favorite = false;
            if(attachUserData){
                const foundVillager = userData.favVillagers.find(villager => villager.id === docData.id);
                if (foundVillager){
                    docData.favorite = true;    
                }
            }

            callback({villager: docData, lastDocRef: change.doc, changeType: change.type});           
        })

        if(snapshot.metadata.fromCache){
            console.log('Data came from cache');
        }

        //currentDoc = doc;
        //console.log(snapshot);
        //callback({villagers, lastDocRef: currentDoc})
    });

    unsubArray.push(unsub);

    //return {villagers, lastDocRef: currentDoc};
}

function unsubFromChanges(){
    unsubArray.forEach(unsub => {
        console.log('unsubbed');
        unsub();    
    });
    unsubArray = [];
}

async function getCollectionStats(collectionRef){
    // d = await collectionRef.doc('---stats---');
    const statsDoc = await getDoc(doc(collectionRef,'---stats---'));
    return statsDoc.data();   
}

async function toggleFavorites(user,villagerID,inFavorites){

   const userDataRef = doc(db, 'userData', user.uid);
   const villagerRef = doc(db, 'villagers', villagerID);

   await setDoc(userDataRef, {}, {merge: true});

   if(inFavorites){
       await updateDoc(userDataRef, {favVillagers: arrayRemove(villagerRef)}); 
       await updateDoc(villagerRef, {likes: increment(-1)}); 
   } else {
       await updateDoc(userDataRef, {favVillagers: arrayUnion(villagerRef)});
       await updateDoc(villagerRef, {likes: increment(1)});
   }
   
   console.log('added/rem fav:', villagerID);
}

async function getUserData(user){
    //q = query();
    const userDataRef = doc(db, 'userData', user.uid);
    const userData = await getDoc(userDataRef);
    // if(userData.exists()){
    return userData.data();
    // }
}

export {addVillagers, getVillagers , getCollectionStats, toggleFavorites, getUserData, unsubFromChanges};




