import { isThisMinute } from "date-fns";
import { th } from "date-fns/locale";
import { query, orderBy, limit, startAfter, limitToLast, getDocs, startAt, where } from "firebase/firestore";
import { getCollectionStats, getVillagers, unsubFromChanges } from "./data_handler";

class Paginator{
    
    constructor(collectionRef, orderBy, maxItemsOnPage, uiInstance){
        this.collectionRef = collectionRef;
        this.orderBy = orderBy;
        this.maxItemsOnPage = maxItemsOnPage;
        this.lastDoc = null;
        this.uiInstance = uiInstance;
        this.colStats = null;
        this.itemsLoaded = 0;
        this.filter = null;
    }

    async getData(callback){

        if(this.colStats === null){
            this.colStats = await getCollectionStats(this.collectionRef);
        }

        let q = query(
                this.collectionRef,
                orderBy(this.orderBy,"asc"),
                startAfter(this.lastDoc || 0),
                limit(this.maxItemsOnPage)
            );     

        //console.log('f: ', this.filter);
        if(this.filter && this.filter.length > 0){
            console.log(q);
            q = query(q,where('type', 'in', this.filter));
        }

        // await getVillagers(q)
        //     .then(result => {
        //         this.uiInstance.renderVillagers(result.villagers);
        //         this.lastDoc = result.lastDocRef;
        //         this.itemsLoaded += result.villagers.length;
        //         console.log('load info: ', this.itemsLoaded, this.colStats.count);
        //         //TODO: rework when data is filtered
        //         if(this.itemsLoaded === this.colStats.count){
        //             callback();
        //         } 
        //     });

        getVillagers(q, (result) => {
            //console.log(res);
            this.uiInstance.renderVillager(result.villager, result.changeType);
            this.lastDoc = result.lastDocRef;
            if(result.changeType === 'added'){
                this.itemsLoaded += 1;
            } else if (result.changeType === 'removed'){
                this.itemsLoaded -= 1;
            }
            console.log('load info: ', this.itemsLoaded, this.colStats.count, result.changeType);
        })
    }

    reset(){
        this.lastDoc = null;
        this.itemsLoaded = 0;
        unsubFromChanges();    
    }
}

export {Paginator as default};