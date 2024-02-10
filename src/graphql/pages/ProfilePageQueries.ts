import {gql} from '@apollo/client'

export const getProfilesQ = gql`
    query {
        getProfiles {
            account_id
            username
            security_code
            telegram
            role
            weekday
            region
            cords {
                lat
                long
            }
            main_photo
            childs {
                shortid
                fullname
                sex
                status
                image
            }
            manuscripts {
                shortid
                title
                category
                words
                image
                likes
                dateUp
            }
            account_components {
                shortid
                title
                path
            }
        }
    }
`

export const getProfileM = gql`
    mutation getProfile($account_id: String!) {
        getProfile(account_id: $account_id) {
            account_id
            username
            security_code
            telegram
            role
            weekday
            region
            cords {
                lat
                long
            }
            main_photo
            childs {
                shortid
                fullname
                sex
                status
                image
            }
            manuscripts {
                shortid
                title
                category
                words
                image
                likes
                dateUp
            }
            account_components {
                shortid
                title
                path
            }
        }
    }
`