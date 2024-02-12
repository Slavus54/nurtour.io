import {useState, useMemo} from 'react'
import {useMutation} from '@apollo/client'
//@ts-ignore
import Centum from 'centum.js'
//@ts-ignore
import {Datus} from 'datus.js'
import {MANUSCRIPT_TYPES, WORDS_LIMIT} from '../../env/env'
import {ModernAlert} from '../UI/ModernAlert'
import DataPagination from '../UI/DataPagination'
import CloseIt from '../UI/CloseIt'
import ImageLoader from '../UI/ImageLoader'
import ImageLook from '../UI/ImageLook'
import {manageProfileManuscriptM} from '../../graphql/profile/ProfileQueries'
import {AccountPageComponentProps} from '../../types/types'

const ProfileManuscripts = ({profile, context}: AccountPageComponentProps) => {
    const [manuscripts, setManuscripts] = useState<any[]>([])
    const [manuscript, setManuscript] = useState<any | null>(null)
    const [image, setImage] = useState<string>('')
    const [percent, setPercent] = useState<number>(50)
    const datus = new Datus()
    const [state, setState] = useState({
        title: '', 
        category: MANUSCRIPT_TYPES[0], 
        words: 0, 
        dateUp: datus.move()
    })

    const centum = new Centum()

    const {title, category, words, dateUp} = state   

    const [manageProfileManuscript] = useMutation(manageProfileManuscriptM, {
        optimisticResponse: true,
        onCompleted(data) {
            ModernAlert(data.manageProfileManuscript)
        }
    })

    useMemo(() => {
        setState({...state, words: centum.part(percent, WORDS_LIMIT)})
    }, [percent])

    const onManageManuscript = (option: string) => {
        manageProfileManuscript({
            variables: {
                account_id: context.account_id, option, title, category, words, image, dateUp, coll_id: manuscript === null ? '' : manuscript.shortid
            }
        })
    }

    return (
        <>
            {manuscript === null ? 
                    <>
                        <textarea value={title} onChange={e => setState({...state, title: e.target.value})} placeholder='Title of manuscript' />

                        <h4 className='pale'>Type</h4>
                        <div className='items small'>
                            {MANUSCRIPT_TYPES.map(el => <div onClick={() => setState({...state, category: el})} className={el === category ? 'item label active' : 'item label'}>{el}</div>)}
                        </div>

                        <h4 className='pale'>Words: <b>{words}</b></h4>
                        <input value={percent} onChange={e => setPercent(parseInt(e.target.value))} type='range' step={1} />

                        <ImageLoader setImage={setImage} />

                        <button onClick={() => onManageManuscript('create')}>Create</button>

                        <DataPagination initialItems={profile.manuscripts} setItems={setManuscripts} label='Manuscripts:' />
                        <div className='items half'>
                            {manuscripts.map(el => 
                                <div onClick={() => setManuscript(el)} className='item panel'>
                                    {centum.shorter(el.title)}
                                </div>    
                            )}
                        </div>
                    </>
                :
                    <>
                        <CloseIt onClick={() => setManuscript(null)} />
                        
                        {manuscript.image !== '' && <ImageLook src={manuscript.image} className='photo_item' alt='manuscript photo' />}
                                
                        <h2>{manuscript.title}</h2>          
                        <div className='items small'>
                            <h4 className='pale'>Type: {manuscript.category}</h4>
                            <h4 className='pale'><b>{manuscript.likes}</b> likes</h4>
                        </div>

                        <button onClick={() => onManageManuscript('delete')}>Delete</button>
                    </>
            }
        </> 
    )
}

export default ProfileManuscripts