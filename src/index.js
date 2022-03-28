import './data_handler.js';
import { addVillagers, getVillagers } from './data_handler.js';
import UI from './ui.js'

const ui = new UI;
ui.init();

ui.loadVillagersFromLocal_btn.addEventListener('click', async () => {
    const response = await fetch('./data.json');
    const data = await response.json();
    addVillagers(data)
        .then(()=> console.log('finished loading'))
        .catch(err => console.log(err.message));
});

getVillagers().then(villagers => console.log(villagers));




