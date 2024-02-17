import Centum from 'centum.js'
import {createSlice} from '@reduxjs/toolkit'

const centum = new Centum()

export const routeSlice = createSlice({
    name: 'route',
    initialState: {
        locations: []
    },  
    reducers: {
        init: state => {
            state.locations = []            
        },
        append: (state, action) => {
            let check = state.locations.find(el => centum.search(el.shortid, action.payload.shortid, 100))

            if (check === undefined) {
                state.locations = [...state.locations, action.payload]
            }
        }
    }
})

export const {init, append} = routeSlice.actions

export default routeSlice.reducer