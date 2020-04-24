const axios = require('axios');
/* handles calls to the api */
class Proxy{
    constructor(){
        this.symbols = [];
    }
    async search(query) {
        try{
            const manaSymbolsLoaded = this.symbols.length > 0;
            if(!manaSymbolsLoaded){await this.loadSymbols();}
            let url = this.buildURL(query);
            const response = await this.api(url);
            console.log(this.symbols);
            return this.process(query,response);

        } catch(e){
            console.log(e);
            return {total:0,page:1,data:[]};
        }
    }
    process(query,response){
        let page;
        let total;
        let data;
        if(response.data.object === 'card'){
            total = 1;
            page = 1;
            //console.log(response.data);
            data = [response.data];
        }else if(response.data.object === 'list'){
            page = 1;
            //console.log(response.data);
            if(query.page){
                page = query.page;
            }
            total = response.data.total_cards; //number of cards from the list of search results
            data = response.data.data; //the actual card data
        }
        const result = {total:total,page:page,data:data};
        return result;
    }
    buildURL(query){
        let url = process.env.PROXY_BASE; //link to the api
        if(query.id){
            url+= query.id; //adds an id the end of the query
        }else{
            let page = 1;
            if(query.page){page = query.page;}
            url += process.env.PROXY_SEARCH_BASE + page;
            url += process.env.PROXY_QUERY_BASE;
            if (query.name) {
                url += process.env.PROXY_QUERY_PARAM_NAME + query.name;
            }
        }
        //console.log(url); //checking what is sent to the db
        return url;
    }
    async api(url){
        return await axios.get(url).then((response)=>{
          return response;
        }).catch((e)=>{
            throw new Error(e);
        });
    }
    async loadSymbols(){
        const response =  await this.api(process.env.PROXY_SYMBOLS);
        this.symbols = response.data.data;
    }
    getManaSymbols(manaCost){
        let symbols = [];
        this.symbols.forEach((symbol)=>{
            if(manaCost.includes(symbol.symbol)){
                symbols.push(symbol);
            }
        });
        return symbols;
    }
}


module.exports = Proxy;