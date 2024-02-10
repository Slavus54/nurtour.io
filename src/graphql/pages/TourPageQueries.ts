import {gql} from '@apollo/client'

export const createTourM = gql`
    mutation createTour($username: String!, $id: String!, $title: String!, $category: String!, $region: String!, $cords: ICord!, $rating: Float!) {
        createTour(username: $username, id: $id, title: $title, category: $category, region: $region, cords: $cords, rating: $rating)
    }
`

export const getToursQ = gql`
    query {
        getTours {
            shortid
            account_id
            username
            title
            category
            region
            cords {
                lat
                long
            }
            rating
            locations {
                shortid
                name
                title
                category
                image  
                cords {
                    lat
                    long
                }
                likes
            }
            facts {
                shortid
                name
                text
                level
                isTrue
            }
        }
    }
`

export const getTourM = gql`
    mutation getTour($shortid: String!) {
        getTour(shortid: $shortid) {
            shortid
            account_id
            username
            title
            category
            region
            cords {
                lat
                long
            }
            rating
            locations {
                shortid
                name
                title
                category
                image  
                cords {
                    lat
                    long
                }
                likes
            }
            facts {
                shortid
                name
                text
                level
                isTrue
            }
        }
    }
`

export const manageTourLocationM = gql`
    mutation manageTourLocation($username: String!, $id: String!, $option: String!, $title: String!, $category: String!, $image: String!, $cords: ICord!, $coll_id: String!) {
        manageTourLocation(username: $username, id: $id, option: $option, title: $title, category: $category, image: $image, cords: $cords, coll_id: $coll_id)
    }
`

export const updateTourRatingM = gql`
    mutation updateTourRating($username: String!, $id: String!, $rating: Float!) {
        updateTourRating(username: $username, id: $id, rating: $rating)
    }
`

export const makeTourFactM = gql`
    mutation makeTourFact($username: String!, $id: String!, $text: String!, $level: String!, $isTrue: Boolean!) {
        makeTourFact(username: $username, id: $id, text: $text, level: $level, isTrue: $isTrue)
    }
`