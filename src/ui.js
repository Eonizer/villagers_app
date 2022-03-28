class UI {

    init(){
        this.btnStyle = 'bg-emerald-300 py-1 px-2 rounded-md mr-2';
        this.itemStyle = 'item bg-slate-300 w-200 p-2';
        this.body = document.querySelector('body');
        this.loadVillagersFromLocal_btn = this.addElement(this.body.querySelector('.command-panel'),'load_local ' + this.btnStyle,'Load from JSON','button');
    }
    addElement(parent, classes, text, type){
        let element = document.createElement(type);
        // button.classList.add(btn_class);
        // console.log(button.classList);
        this.addClasses(element, classes);
        element.textContent = text;
        parent.appendChild(element); 
        return element;
    }
    addClasses(element, styleString){
        const styles = styleString.split(' ');
        //console.log(styles);
        styles.forEach((style) => {
            element.classList.add(style);
        });
    }
    renderVillagers(villagers){
        villagers.forEach(villager => {
            // console.log(document.querySelector('#villagers-grid'));
            const item = this.addElement(document.querySelector('#villagers-grid'), this.itemStyle, '', 'div');
            const html = `
            <p>Имя: ${villager.name}</p>
            
            <img src="${villager.picURL}" alt="noimg">
            <p>Хобби: ${villager.hobby}</p>
            <small>ID: ${villager.id}</small>          
            `;
            item.innerHTML = html;
        });
    }
};

//https://static.wikia.nocookie.net/animal-crossing/images/4/49/%D0%9F%D0%BE%D1%81%D1%82%D0%B5%D1%80_%D0%9C%D0%B5%D1%80%D1%80%D0%B8_NH.png/revision/latest?cb=20200601080026&path-prefix=ru

export {UI as default};

