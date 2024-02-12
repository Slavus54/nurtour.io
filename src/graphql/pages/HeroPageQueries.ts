import {gql} from '@apollo/client'

export const createHeroM = gql`
    mutation createHero($username: String!, $id: String!, $fullname: String!, $positions: [String]!, $country: String!, $century: String!, $image: String!) {
        createHero(username: $username, id: $id, fullname: $fullname, positions: $positions, country: $country, century: $century, image: $image)
    }
`

export const getHeroesQ = gql`
    query {
        getHeroes {
            shortid
            account_id
            username
            fullname
            positions
            country
            century
            image
            quotes {
                shortid
                name
                text
                category
                likes
            }
            achievements {
                shortid
                name
                title
                position
                level
            }
        }
    }
`

export const getHeroM = gql`
    mutation getHero($shortid: String!) {
        getHero(shortid: $shortid) {
            shortid
            account_id
            username
            fullname
            positions
            country
            century
            image
            quotes {
                shortid
                name
                text
                category
                likes
            }
            achievements {
                shortid
                name
                title
                position
                level
            }
        }
    }
`

export const updateHeroPhotoM = gql`
    mutation updateHeroPhoto($username: String!, $id: String!, $image: String!) {
        updateHeroPhoto(username: $username, id: $id, image: $image)
    }
`

export const makeHeroAchievementM = gql`
    mutation makeHeroAchievement($username: String!, $id: String!, $title: String!, $position: String!, $level: String!) {
        makeHeroAchievement(username: $username, id: $id, title: $title, position: $position, level: $level)
    }
`

export const manageHeroQuoteM = gql`
    mutation manageHeroQuote($username: String!, $id: String!, $option: String!, $text: String!, $category: String!, $coll_id: String!) {
        manageHeroQuote(username: $username, id: $id, option: $option, text: $text, category: $category, coll_id: $coll_id)
    }
`