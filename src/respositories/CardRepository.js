const Repository = require('./Repository');
const Card = require('../models/Card');
const DeckCard = require('../models/DeckCard');

class CardRepository extends Repository{
    constructor(database,proxy){
        super('deck_card',database);
        this.proxy = proxy;
    }
    async searchCards(name){
        const results = await this.proxy.search(name);
        const cards = this.makeMany(results);
        console.log(cards);
        return cards;
    }
    async getCard(id){
        const result = await this.proxy.get(id);
        return this.make(result);
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
     makeMany(data){
        const cards = [];
        for(let i = 0; i < data.length; i++){
            const rawCard = data[i];
            const card = this.make(rawCard);
            cards.push(card);
        }
        return cards;
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
            data.image_uris.small);
    }
}
module.exports = CardRepository;