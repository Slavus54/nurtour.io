import {gql} from '@apollo/client'

export const createRecipeM = gql`
    mutation createRecipe($username: String!, $id: String!, $title: String!, $category: String!, $cuisine: String!, $level: String!, $ingredients: [String]!, $steps: [IStep]!, $time: Float!, $calories: Float!, $link: String!, $rating: Float!) {
        createRecipe(username: $username, id: $id, title: $title, category: $category, cuisine: $cuisine, level: $level, ingredients: $ingredients, steps: $steps, time: $time, calories: $calories, link: $link, rating: $rating) 
    }
`

export const getRecipesQ = gql`
    query {
        getRecipes {
            shortid
            account_id
            username
            title
            category
            cuisine
            level
            ingredients
            steps {
                id
                content
                duration
            }
            time
            calories
            link
            rating
            cookings {
                shortid
                name
                text
                image
                likes
                dateUp
            }
            healthes {
                shortid
                name
                ingredient
                category
                percent
            }
        }
    }
`

export const getRecipeM = gql`
    mutation getRecipe($shortid: String!) {
        getRecipe(shortid: $shortid) {
            shortid
            account_id
            username
            title
            category
            cuisine
            level
            ingredients
            steps {
                id
                content
                duration
            }
            time
            calories
            link
            rating
            cookings {
                shortid
                name
                text
                image
                likes
                dateUp
            }
            healthes {
                shortid
                name
                ingredient
                category
                percent
            }
        }
    }
`

export const manageRecipeCookingM = gql`
    mutation manageRecipeCooking($username: String!, $id: String!, $option: String!, $text: String!, $image: String!, $dateUp: String!, $coll_id: String!) {
        manageRecipeCooking(username: $username, id: $id, option: $option, text: $text, image: $image, dateUp: $dateUp, coll_id: $coll_id)
    }
`

export const makeRecipeHealthM = gql`
    mutation makeRecipeHealth($username: String!, $id: String!, $ingredient: String!, $category: String!, $percent: Float!) {
        makeRecipeHealth(username: $username, id: $id, ingredient: $ingredient, category: $category, percent: $percent)
    }
`

export const updateRecipeInfoM = gql`
    mutation updateRecipeInfo($username: String!, $id: String!, $link: String!, $rating: Float!) {
        updateRecipeInfo(username: $username id: $id, link: $link, rating: $rating)
    }
`

export const updateRecipeStepM = gql`
    mutation updateRecipeStep($username: String!, $id: String!, $coll_id: String!, $content: String!) {
        updateRecipeStep(username: $username id: $id, coll_id: $coll_id, content: $content)
    }
`