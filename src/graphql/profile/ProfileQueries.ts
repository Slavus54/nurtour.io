import {gql} from '@apollo/client'

export const updateProfilePersonalInfoM = gql`
    mutation updateProfilePersonalInfo($account_id: String!, $main_photo: String!) {
        updateProfilePersonalInfo(account_id: $account_id, main_photo: $main_photo) 
    }
`

export const updateProfileGeoInfoM = gql`
    mutation updateProfileGeoInfo($account_id: String!, $region: String!, $cords: ICord!) {
        updateProfileGeoInfo(account_id: $account_id, region: $region, cords: $cords) 
    }
`

export const updateProfileCommonInfoM = gql`
    mutation updateProfileCommonInfo($account_id: String!, $role: String!, $weekday: String!) {
        updateProfileCommonInfo(account_id: $account_id, role: $role, weekday: $weekday)
    }
`

export const updateProfileSecurityCodeM = gql`
    mutation updateProfileSecurityCode($account_id: String!, $security_code: String!) {
        updateProfileSecurityCode(account_id: $account_id, security_code: $security_code)
    }
`

export const manageProfileChildM = gql`
    mutation manageProfileChild($account_id: String!, $option: String!, $fullname: String!, $sex: String!, $status: String!, $image: String!, $coll_id: String!) {
        manageProfileChild(account_id: $account_id, option: $option, fullname: $fullname, sex: $sex, status: $status, image: $image, coll_id: $coll_id)
    }
`

export const manageProfileManuscriptM = gql`
    mutation manageProfileManuscript($account_id: String!, $option: String!, $title: String!, $category: String!, $words: Float!, $image: String!, $dateUp: String!, $coll_id: String!) {
        manageProfileManuscript(account_id: $account_id, option: $option, title: $title, category: $category, words: $words, image: $image, dateUp: $dateUp, coll_id: $coll_id)
    }
`

export const registerM = gql`
    mutation register($username: String!, $security_code: String!, $telegram: String!, $role: String!, $weekday: String!, $region: String!, $cords: ICord!, $main_photo: String!) {
        register(username: $username, security_code: $security_code, telegram: $telegram, role: $role, weekday: $weekday, region: $region, cords: $cords, main_photo: $main_photo) {
            account_id
            username
            role
        }
    }
`

export const loginM = gql`
    mutation login($security_code: String!) {
        login(security_code: $security_code) {
            account_id
            username
            role
        }
    }
`
