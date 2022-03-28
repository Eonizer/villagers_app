class UI {
    init(){
        this.body = document.querySelector('body');
        this.loadVillagersFromLocal_btn = this.addButton(this.body,'load_local','Load from JSON');
    }
    addButton(parent, btn_class, text){
        let button = document.createElement('button');
        button.classList.add(btn_class);
        button.textContent = text;
        parent.appendChild(button); 
        return button;
    }
};

export {UI as default};