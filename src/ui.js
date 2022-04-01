import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { Timestamp } from 'firebase/firestore';
import { storage } from './fb.js';
import { getStorage, getDownloadURL, ref } from 'firebase/storage';

class UI {

    init(){
        this.body = document.querySelector('body');
        this.storageRef = ref(storage,'villagers');
        this.grid = document.querySelector('#villagers-grid');
    }
    addElement(parent, classes, text, type, attributes = null){
        let element = document.createElement(type);
        if(attributes !== null){
            for(const prop in attributes){
                element.setAttribute(prop, attributes[prop]);
            }
        };
        this.addClasses(element, classes);
        element.textContent = text;
        parent.appendChild(element); 
        return element;
    }
    addClasses(element, styleString){
        const styles = styleString.trim().split(' ');
        styles.forEach((style) => {
            element.classList.add(style);
        });
    }
    renderVillager(villager, changeType){

        //villagers.forEach(villager => {
        
        let item = null;
        const likes = villager.likes ? villager.likes : '';
        //const favorite = villager.favorite ? ;

        let favStarClass = '';
        let favItemClass = '';

        if(villager.favorite){
            favStarClass = 'fill-current';
            favItemClass = 'favorite';
        }

        if(changeType === 'modified'){         
            item = document.getElementById(villager.id);
            
            const likesEl = item.querySelector('.likes-count');
            likesEl.innerHTML = likes;

            const favStarEl = item.querySelector('.fav-star');
            favStarEl.classList.toggle('fill-current');
            item.classList.toggle('favorite');

            return;

        } else if(changeType === 'removed'){
            item = document.getElementById(villager.id);
            this.grid.remove(item);
            return; 
        } else {
            item = this.addElement(this.grid, 'item '+favItemClass, '', 'div', {id: villager.id});
        }

        const birthday = format(villager.birthday.toDate(),'do MMMM', {locale: ru});

        // class="h-"
        const html = `
        <div class="fav-btn absolute left-[70%] text-yellow-300 text-xl">           
            <div class="w-max h-max cursor-pointer inline-block relative active:pointer-events-none">
                <div class="likes-count absolute right-[44%] top-[85%] pointer-events-none">${likes}</div>
                <svg xmlns="http://www.w3.org/2000/svg"class="fav-star ${favStarClass} h-16 w-16 active:pointer-events-none hover:fill-current drop-shadow-lg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path class="pointer-events-none" stroke-linecap="round" stroke-linejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
            </div>
        </div>
        <div>
            <span class="font-bold">${villager.name}</span>        
            <img class="py-2" src="" alt="noimg">
            <p>Хобби: <span class="font-bold">${villager.hobby}</span></p>
            <p>Вид: <span class="font-bold">${villager.type}</span></p>
            <p>День рождения: <span class="font-bold">${birthday}</span></p>
            <p>Личность: <span class="font-bold">${villager.personality}</span></p>
            <p>Коронная фраза: <span class="font-bold">${villager.catchphrase}</span></p>                     
        </div>
        `;

        item.innerHTML = html;

        if(changeType === 'added'){
            getDownloadURL(ref(this.storageRef,`${villager.id}.png`))
            .then(url => {
                const img = item.querySelector('img');
                img.setAttribute('src', url);
            })
            .catch(err => {
                console.log(err);
            });
        }

        //});
    }
    clearVillagers(){
        this.grid.innerHTML = '';
    }
    updateAuthUI(currentUser){

        const userIcon = this.body.querySelector('.user-icon');
        const userImg = this.body.querySelector('.user-img');
        const loginBtn = this.body.querySelector('#login-btn');
        const logoutBtn = this.body.querySelector('#logout-btn');

        if (currentUser) {             
            userIcon.classList.replace('inline-block','hidden');
            loginBtn.classList.add('hidden');

            userImg.classList.replace('hidden','inline-block');
            userImg.setAttribute('src', currentUser.photoURL);
            logoutBtn.classList.remove('hidden');
        } else {          
            userIcon.classList.replace('hidden','inline-block');
            loginBtn.classList.remove('hidden');

            userImg.classList.replace('inline-block','hidden');
            logoutBtn.classList.add('hidden');
        }
    }
};

export {UI as default};

