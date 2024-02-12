import {useState} from 'react'
import {useMutation} from '@apollo/client'
//@ts-ignore
import {weekdays_titles} from 'datus.js'
import {jsPDF} from 'jspdf'
import {ROLES, PDF_ICON, MANIFEST_TEXT} from '../../env/env'
import ImageLook from '../UI/ImageLook'
import {ModernAlert} from '../UI/ModernAlert'
import {updateProfileCommonInfoM} from '../../graphql/profile/ProfileQueries'
import {AccountPageComponentProps} from '../../types/types'

const CommonProfileInfo = ({profile, context}: AccountPageComponentProps) => {
    const [state, setState] = useState({
        role: profile.role, 
        weekday: profile.weekday
    })

    const {role, weekday} = state    

    const doc = new jsPDF({
        orientation: 'landscape'
    })

    const [updateProfileCommonInfo] = useMutation(updateProfileCommonInfoM, {
        optimisticResponse: true,
        onCompleted(data) {
            ModernAlert(data.updateProfileCommonInfo)
        }
    })

    const onDownload = () => {
        doc.text(MANIFEST_TEXT, 10, 10)
        doc.save('manifest.pdf')
    }

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

            <h4 className='pale'>Manifest</h4>

            <ImageLook onClick={onDownload} src={PDF_ICON} min={2} max={2} className='icon' alt='pdf icon' />

            <button onClick={onUpdate}>Update</button>
        </> 
    )
}

export default CommonProfileInfo