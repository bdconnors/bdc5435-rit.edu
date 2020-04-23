const Repository = require('./Repository');
const Card = require('../../models').Card;
const SearchResults = require('../../models').SearchResults;

class CardRepository extends Repository{
    constructor(database,proxy){
        super('deck_card',database);
        this.proxy = proxy;
    }
    async retrieve(query){
        const response = await this.proxy.search(query);
        return this.makeSearchResults(response);
    }
    async getDeckCards(deckId){
        try {
            const results = await this.database.execute('RETRIEVE', 'ALL_DECK_CARD', {deck: deckId});
            const rows = results[0];
            return await this.makeMany(rows);
        }catch (e) {
            throw new Error(e);
        }
    }
    makeSearchResults(response){
        console.log(response.total);
        const searchResults = new SearchResults(response.total);
        searchResults.results = this.makeMany(response.data);
        console.log('repo');
        return searchResults;
    }
    make(data){

        return new Card(data.id,
            data.name,
            data.mana_cost,
            data.cmc,
            data.set_name,
            data.type_line,
            data.colors,
            data.rarity,
            data.oracle_text,
            data.image_uris);
    }
}
module.exports = CardRepository;