import {useState, useMemo} from 'react'
import {useMutation} from '@apollo/client'
//@ts-ignore
import Centum from 'centum.js'
import {GENDERS, CHILD_STATUSES} from '../../env/env'
import {ModernAlert} from '../UI/ModernAlert'
import DataPagination from '../UI/DataPagination'
import CloseIt from '../UI/CloseIt'
import ImageLoader from '../UI/ImageLoader'
import ImageLook from '../UI/ImageLook'
import {manageProfileChildM} from '../../graphql/profile/ProfileQueries'
import {AccountPageComponentProps} from '../../types/types'

const ProfileChilds = ({profile, context}: AccountPageComponentProps) => {
    const [childs, setChilds] = useState<any[]>([])
    const [child, setChild] = useState<any | null>(null)
    const [image, setImage] = useState<string>('')
    const [state, setState] = useState({
        fullname: '', 
        sex: GENDERS[0], 
        status: CHILD_STATUSES[0] 
    })

    const centum = new Centum()

    const {fullname, sex, status} = state   

    const [manageProfileChild] = useMutation(manageProfileChildM, {
        optimisticResponse: true,
        onCompleted(data) {
            ModernAlert(data.manageProfileChild)
        }
    })

    useMemo(() => {
        setImage(child === null ? '' : child.image)

        if (child !== null) {
            setState({...state, status: child.status})
        }
    }, [child])

    const onManageChild = (option: string) => {
        manageProfileChild({
            variables: {
                account_id: context.account_id, option, fullname, sex, status, image, coll_id: child === null ? '' : child.shortid
            }
        })
    }

    return (
        <>
            {child === null ? 
                    <>
                        <input value={fullname} onChange={e => setState({...state, fullname: e.target.value})} placeholder='Name of child' type='text' />

                        <h4 className='pale'>Status</h4>
                        <div className='items small'>
                            {CHILD_STATUSES.map(el => <div onClick={() => setState({...state, status: el})} className={el === status ? 'item label active' : 'item label'}>{el}</div>)}
                        </div>

                        <select value={sex} onChange={e => setState({...state, sex: e.target.value})}>
                            {GENDERS.map(el => <option value={el}>{el}</option>)}
                        </select>

                        <ImageLoader setImage={setImage} />

                        <button onClick={() => onManageChild('create')}>Create</button>

                        <DataPagination initialItems={profile.childs} setItems={setChilds} label='Childs:' />
                        <div className='items half'>
                            {childs.map(el => 
                                <div onClick={() => setChild(el)} className='item panel'>
                                    {centum.shorter(el.fullname)}
                                </div>    
                            )}
                        </div>
                    </>
                :
                    <>
                        <CloseIt onClick={() => setChild(null)} />
                        
                        {image !== '' && <ImageLook src={image} className='photo_item' alt='child photo' />}
                                
                        <h2>{child.fullname}</h2>          
                        <h4 className='pale'>Sex: {child.sex}</h4>

                        <div className='items small'>
                            {CHILD_STATUSES.map(el => <div onClick={() => setState({...state, status: el})} className={el === status ? 'item label active' : 'item label'}>{el}</div>)}
                        </div>

                        <ImageLoader setImage={setImage} />

                        <div className='items small'>
                            <button onClick={() => onManageChild('delete')}>Delete</button>
                            <button onClick={() => onManageChild('update')}>Update</button>
                        </div>
                    </>
            }
        </> 
    )
}

export default ProfileChilds