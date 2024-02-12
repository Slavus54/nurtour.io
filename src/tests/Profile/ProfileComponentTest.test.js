import {checkTownTitle, town_title_attempts} from '../test-api'

describe('Profile Component Test Running', () => {
    it(`Trying to change my location entering town ${town_title_attempts.length} times`, () => {

        town_title_attempts.map(el => expect(checkTownTitle(el)).toBe(true))
    })
})