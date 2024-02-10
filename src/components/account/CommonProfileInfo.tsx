import {useState} from 'react'
import {useMutation} from '@apollo/client'
//@ts-ignore
import {weekdays_titles} from 'datus.js'
import {ROLES} from '../../env/env'
import {ModernAlert} from '../UI/ModernAlert'
import {updateProfileCommonInfoM} from '../../graphql/profile/ProfileQueries'
import {AccountPageComponentProps} from '../../types/types'

const CommonProfileInfo = ({profile, context}: AccountPageComponentProps) => {
    const [state, setState] = useState({
        role: profile.role, 
        weekday: profile.weekday
    })

    const {role, weekday} = state    

    const [updateProfileCommonInfo] = useMutation(updateProfileCommonInfoM, {
        optimisticResponse: true,
        onCompleted(data) {
            ModernAlert(data.updateProfileCommonInfo)
        }
    })

    const onUpdate = () => {
        updateProfileCommonInfo({
            variables: {
                account_id: context.account_id, role, weekday
            }
        })
    }
 
    return (
        <>
            <div className='items small'>
                <select value={role} onChange={e => setState({...state, role: e.target.value})}>
                    {ROLES.map(el => <option value={el}>{el}</option>)}
                </select>
                <select value={weekday} onChange={e => setState({...state, weekday: e.target.value})}>
                    {weekdays_titles.map(el => <option value={el}>{el}</option>)}
                </select>
            </div>

            <button onClick={onUpdate}>Update</button>
        </> 
    )
}

export default CommonProfileInfo