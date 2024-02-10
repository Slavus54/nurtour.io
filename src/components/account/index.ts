import PersonalProfileInfo from './PersonalProfileInfo'
import GeoProfileInfo from './GeoProfileInfo'
import CommonProfileInfo from './CommonProfileInfo'
import ProfileSecurity from './ProfileSecurity'
import ProfileChilds from './ProfileChilds'
import ProfileManuscripts from './ProfileManuscripts'
import ProfileComponents from './ProfileComponents'

import {AccountPageComponentType} from '../../types/types'

const components: AccountPageComponentType[] = [
    {
        title: 'Profile',
        icon: 'https://img.icons8.com/ios/50/edit-user-male.png',
        component: PersonalProfileInfo
    },
    {
        title: 'Location',
        icon: 'https://img.icons8.com/external-flatart-icons-outline-flatarticons/64/external-location-modern-business-and-business-essentials-flatart-icons-outline-flatarticons.png',
        component: GeoProfileInfo
    },
    {
        title: 'Information',
        icon: 'https://img.icons8.com/ios/50/settings--v1.png',
        component: CommonProfileInfo
    },
    {
        title: 'Security',
        icon: 'https://img.icons8.com/dotty/80/security-configuration.png',
        component: ProfileSecurity
    },
    {
        title: 'Childs',
        icon: 'https://img.icons8.com/ios/50/teenager-male.png',
        component: ProfileChilds
    },
    {
        title: 'Manuscripts',
        icon: 'https://img.icons8.com/external-icongeek26-outline-icongeek26/64/external-Manuscript-content-edition-icongeek26-outline-icongeek26-2.png',
        component: ProfileManuscripts
    },
    {
        title: 'Collections',
        icon: 'https://img.icons8.com/dotty/80/list.png',
        component: ProfileComponents
    }
]

export const default_component = components[0]

export default components