import {gql} from '@apollo/client'

export const createMasterpieceM = gql`
    mutation createMasterpiece($username: String!, $id: String!, $title: String!, $category: String!, $country: String!, $epoch: String!, $main_photo: String!) {
        createMasterpiece(username: $username, id: $id, title: $title, category: $category, country: $country, epoch: $epoch, main_photo: $main_photo) 
    }
`

export const getMasterpiecesQ = gql`
    query {
        getMasterpieces {
            shortid
            account_id
            username
            title
            category
            country
            epoch
            main_photo
            pictures {
                shortid
                name
                text
                category
                image
                likes
            }
            channels {
                shortid
                name
                title
            }
        }
    }
`

export const getMasterpieceM = gql`
    mutation getMasterpiece($shortid: String!) {
        getMasterpiece(shortid: $shortid) {
            shortid
            account_id
            username
            title
            category
            country
            epoch
            main_photo
            pictures {
                shortid
                name
                text
                category
                image
                likes
            }
            channels {
                shortid
                name
                title
            }
        }
    }
`

export const manageMasterpiecePictureM = gql`
    mutation manageMasterpiecePicture($username: String!, $id: String!, $option: String!, $text: String!, $category: String!, $image: String!, $coll_id: String!) {
        manageMasterpiecePicture(username: $username, id: $id, option: $option, text: $text, category: $category, image: $image, coll_id: $coll_id)
    }
`

export const manageMasterpieceChannelM = gql`
    mutation manageMasterpieceChannel($username: String!, $id: String!, $option: String!, $title: String!, $coll_id: String!) {
        manageMasterpieceChannel(username: $username, id: $id, option: $option, title: $title, coll_id: $coll_id)
    }
`