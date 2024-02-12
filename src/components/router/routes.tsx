import Home from '../pages/Home'
import Login from '../pages/Login'
import Register from '../pages/Register'
import CreateTour from '../pages/CreateTour'
import Tours from '../pages/Tours'
import Tour from '../pages/Tour'
import CreateRecipe from '../pages/CreateRecipe'
import Recipes from '../pages/Recipes'
import Recipe from '../pages/Recipe'
import CreateJob from '../pages/CreateJob'
import Jobs from '../pages/Jobs'
import Job from '../pages/Job'
import CreateHero from '../pages/CreateHero'
import Heroes from '../pages/Heroes'
import Hero from '../pages/Hero'
import Profiles from '../pages/Profiles'
import Profile from '../pages/Profile'

import {RouteType} from '../../types/types'

export const routes: RouteType[] = [
    {
        title: 'Home',
        access_value: 0,
        url: '/',
        component: Home,
        isVisible: true
    },
    {
        title: 'My Account',
        access_value: -1,
        url: '/login',
        component: Login,
        isVisible: true
    },
    {
        title: 'Tours',
        access_value: 1,
        url: '/tours',
        component: Tours,
        isVisible: true
    },
    {
        title: 'Recipes',
        access_value: 1,
        url: '/recipes',
        component: Recipes,
        isVisible: true
    },
    {
        title: 'Jobs',
        access_value: 1,
        url: '/jobs',
        component: Jobs,
        isVisible: true
    },
    {
        title: 'Heroes',
        access_value: 1,
        url: '/heroes',
        component: Heroes,
        isVisible: true
    },
    {
        title: 'Profiles',
        access_value: 1,
        url: '/profiles',
        component: Profiles,
        isVisible: true
    },
    {
        title: '',
        access_value: -1,
        url: '/register',
        component: Register,
        isVisible: false
    },
    {
        title: '',
        access_value: 1,
        url: '/create-tour/:id',
        component: CreateTour,
        isVisible: false
    },
    {
        title: '',
        access_value: 1,
        url: '/tour/:id',
        component: Tour,
        isVisible: false
    },
    {
        title: '',
        access_value: 1,
        url: '/create-recipe/:id',
        component: CreateRecipe,
        isVisible: false
    },
    {
        title: '',
        access_value: 1,
        url: '/recipe/:id',
        component: Recipe,
        isVisible: false
    },
    {
        title: '',
        access_value: 1,
        url: '/create-job/:id',
        component: CreateJob,
        isVisible: false
    },
    {
        title: '',
        access_value: 1,
        url: '/job/:id',
        component: Job,
        isVisible: false
    },
    {
        title: '',
        access_value: 1,
        url: '/create-hero/:id',
        component: CreateHero,
        isVisible: false
    },
    {
        title: '',
        access_value: 1,
        url: '/hero/:id',
        component: Hero,
        isVisible: false
    },
    {
        title: '',
        access_value: 1,
        url: '/profile/:id',
        component: Profile,
        isVisible: false
    }
]