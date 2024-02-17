import React, {useState, useMemo, useEffect, useContext} from 'react'
import {useMutation} from '@apollo/client'
import {PICTURE_TYPES} from '../../env/env'
//@ts-ignore
import Centum from 'centum.js'
import {Context} from '../../context/WebProvider'
import Loading from '../UI/Loading'
import ImageLoader from '../UI/ImageLoader'
import ImageLook from '../UI/ImageLook'
import CloseIt from '../UI/CloseIt'
import LikeButton from '../UI/LikeButton'
import DataPagination from '../UI/DataPagination'
import {ModernAlert} from '../UI/ModernAlert'
import {getMasterpieceM, manageMasterpiecePictureM, manageMasterpieceChannelM} from '../../graphql/pages/MasterpiecePageQueries'
import {CollectionPropsType} from '../../types/types'

const Masterpiece: React.FC<CollectionPropsType> = ({params: {id}}) => {
    const {context} = useContext<any>(Context)
    const [image, setImage] = useState<string>('')
    const [masterpiece, setMasterpiece] = useState(null)
    const [pictures, setPictures] = useState<any[]>([])
    const [picture, setPicture] = useState<any | null>(null)
    const [channels, setChannels] = useState<any[]>([])
    const [channel, setChannel] = useState<any | null>(null)
    const [state, setState] = useState({
        text: '',
        category: PICTURE_TYPES[0],
        title: ''
    })

    const centum = new Centum()

    const {text, category, title} = state

    const [getMasterpiece] = useMutation(getMasterpieceM, {
        optimisticResponse: true,
        onCompleted(data) {
            setMasterpiece(data.getMasterpiece)
        }
    })

    const [manageMasterpiecePicture] = useMutation(manageMasterpiecePictureM, {
        optimisticResponse: true,
        onCompleted(data) {
            ModernAlert(data.manageMasterpiecePicture)
        }
    })

    const [manageMasterpieceChannel] = useMutation(manageMasterpieceChannelM, {
        optimisticResponse: true,
        onCompleted(data) {
            ModernAlert(data.manageMasterpieceChannel)
        }
    })

    useEffect(() => {
        if (context.account_id !== '') {
            getMasterpiece({
                variables: {
                    shortid: id
                }
            }) 
        }
    }, [context.account_id])

    useMemo(() => {
        setImage(picture === null ? '' : picture.image)
    }, [picture])
    
    const onManagePicture = (option: string) => {
        manageMasterpiecePicture({
            variables: {
                username: context.username, id, option, text, category, image, coll_id: picture === null ? '' : picture.shortid 
            }
        })
    }

    const onManageChannel = (option: string) => {
        manageMasterpieceChannel({
            variables: {
                username: context.username, id, option, title, coll_id: channel === null ? '' : channel.shortid 
            }
        })
    }

    return (
        <>          
            {masterpiece !== null &&
                <>
                    {masterpiece.main_photo !== '' && <ImageLook src={masterpiece.main_photo} className='photo_item' alt='masterpiece photo' />}

                    <h1>{masterpiece.title}</h1>

                    <div className='items small'>   
                        <h4 className='pale'>Type: {masterpiece.category}</h4>
                        <h4 className='pale'>Country: {masterpiece.country}</h4>
                    </div>

                    {picture === null ?
                            <>
                                <h2>New Photo</h2>
                                <textarea value={text} onChange={e => setState({...state, text: e.target.value})} placeholder='Describe it...' />

                                <h4 className='pale'>Type</h4>
                                <div className='items small'>
                                    {PICTURE_TYPES.map(el => <div onClick={() => setState({...state, category: el})} className={el === category ? 'item label active' : 'item label'}>{el}</div>)}
                                </div> 

                                <ImageLoader setImage={setImage} />

                                <button onClick={() => onManagePicture('create')}>Upload</button>

                                <DataPagination initialItems={masterpiece.pictures} setItems={setPictures} label='Gallery:' />
                                <div className='items half'>
                                    {pictures.map(el => 
                                        <div onClick={() => setPicture(el)} className='item panel'>
                                            {centum.shorter(el.text)}
                                        </div>    
                                    )}
                                </div>
                            </>
                        :
                            <>
                                <CloseIt onClick={() => setPicture(null)} />

                                {image !== '' && <ImageLook src={image} className='photo_item' alt='picture' />}
                                <h2>{picture.text}</h2>

                                <h4>You can load it like main photo</h4>
                                <button onClick={() => onManagePicture('update')} className='light-btn'>Upload</button>

                                <div className='items small'>
                                    <h4 className='pale'>Type: {picture.category}</h4>
                                    <h4 className='pale'><b>{picture.likes}</b> likes</h4>
                                </div>

                                {context.username === picture.name ? 
                                        <button onClick={() => onManagePicture('delete')}>Delete</button>
                                    :
                                        <LikeButton onClick={() => onManagePicture('like')} />
                                }                                   
                            </>
                    }

                    {channel === null ? 
                            <>
                                <h2>New Channel to Chat</h2>

                                <input value={title} onChange={e => setState({...state, title: e.target.value})} placeholder='Title of channel' type='text' />

                                <button onClick={() => onManageChannel('create')}>Open</button>

                                <DataPagination initialItems={masterpiece.channels} setItems={setChannels} label='List of channels:' />
                                <div className='items half'>
                                    {channels.map(el => 
                                        <div onClick={() => setChannel(el)} className='item card'>
                                            {centum.shorter(el.title)}
                                        </div>    
                                    )}
                                </div>
                            </>
                        :
                            <>
                                <CloseIt onClick={() => setChannel(null)} />

                                <h2>{channel.title}</h2>

                                {context.username === channel.name ? 
                                        <button onClick={() => onManageChannel('delete')}>Close</button>
                                    :
                                        <>
                                        </>
                                }
                            </>
                    }
                </>
            }

            {masterpiece === null && <Loading />}
        </>
    )
}

export default Masterpiece