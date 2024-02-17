import {configureStore} from '@reduxjs/toolkit'
import routeSlice from './route/RouteSlice'

export const store = configureStore({
    reducer: {
        route: routeSlice
    }
})

export type RouteState = ReturnType<typeof store.getState>