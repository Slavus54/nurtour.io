const Centum = require('centum.js')
const {SEARCH_PERCENT} = require('../env/env')

const centum = new Centum()
const town_title = 'Paris'

const town_title_attempts = ['Paris', 'Pari', 'ari']

const checkTownTitle = (title) => {
    let result = centum.search(town_title, title, SEARCH_PERCENT)

    return result !== undefined
}

module.exports = {checkTownTitle, town_title_attempts}