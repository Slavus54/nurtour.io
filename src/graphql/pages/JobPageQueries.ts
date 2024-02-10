import {gql} from '@apollo/client'

export const createJobM = gql`
    mutation createJob($username: String!, $id: String!, $title: String!, $category: String!, $tasks: [ITask]!, $ageBorder: Float!, $compensation: Float!, $dateUp: String!, $time: String!, $region: String!, $cords: ICord!, $role: String!)  {
        createJob(username: $username, id: $id, title: $title, category: $category, tasks: $tasks, ageBorder: $ageBorder, compensation: $compensation, dateUp: $dateUp, time: $time, region: $region, cords: $cords, role: $role) 
    }
`

export const getJobsQ = gql`
    query {
        getJobs {
            shortid
            account_id
            username
            title
            category
            tasks {
                id
                content
                level
                cost
            }
            ageBorder
            compensation
            dateUp
            time
            region
            cords {
                lat
                long
            }
            members {
                account_id
                username
                role
            }
            photos {
                shortid
                name
                text
                image
                likes
            }
        }
    }
`

export const getJobM = gql`
    mutation getJob($shortid: String!) {
        getJob(shortid: $shortid) {
            shortid
            account_id
            username
            title
            category
            tasks {
                id
                content
                level
                cost
            }
            ageBorder
            compensation
            dateUp
            time
            region
            cords {
                lat
                long
            }
            members {
                account_id
                username
                role
            }
            photos {
                shortid
                name
                text
                image
                likes
            }
        }
    }
`

export const updateJobTaskM = gql`
    mutation updateJobTask($username: String!, $id: String!, $coll_id: String!, $content: String!, $level: String!) {
        updateJobTask(username: $username, id: $id, coll_id: $coll_id, content: $content, level: $level)
    }
`

export const manageJobStatusM = gql`
    mutation manageJobStatus($username: String!, $id: String!, $option: String!, $role: String!) {
        manageJobStatus(username: $username, id: $id, option: $option, role: $role)
    }
`

export const manageJobPhotoM = gql`
    mutation manageJobPhoto($username: String!, $id: String!, $option: String!, $text: String!, $image: String!, $coll_id: String!) {
        manageJobPhoto(username: $username, id: $id, option: $option, text: $text, image: $image, coll_id: $coll_id)
    }
`