import { onSnapshot, collection, addDoc, Timestamp, getDocs } from '@firebase/firestore';
import { async } from '@firebase/util';
import {db} from './fb.js';

const colRef = collection(db, 'villagers');

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

async function getVillagers(){
    return new Promise(async (resolve, reject) => {
        let villagers = [];
        const docs = await getDocs(colRef);
        docs.forEach(doc => {
            let rdoc = doc.data();
            rdoc.id = doc.id;
            villagers.push(rdoc);
        });
        //villagers.push(...docs)
        resolve(villagers);
    })
}

export {addVillagers, getVillagers};




