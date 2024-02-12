import React, {useState, useMemo, useContext} from 'react'
import ReactMapGL, {Marker} from 'react-map-gl'
import {useMutation} from '@apollo/client'
import {TG_ICON, VIEW_CONFIG, token} from '../../env/env'
//@ts-ignore
import Centum from 'centum.js'
import ProfilePhoto from '../../assets/profile_photo.jpg'
import {Context} from '../../context/WebProvider'
import Loading from '../UI/Loading'
import MapPicker from '../UI/MapPicker'
import DataPagination from '../UI/DataPagination'
import ImageLook from '../UI/ImageLook'
import CloseIt from '../UI/CloseIt'
import {ModernAlert} from '../UI/ModernAlert'
import {getProfileM} from '../../graphql/pages/ProfilePageQueries'
import {manageProfileManuscriptM} from '../../graphql/profile/ProfileQueries'
import {CollectionPropsType, Cords} from '../../types/types'

const Profile: React.FC<CollectionPropsType> = ({params: {id}}) => {
    const {context} = useContext<any>(Context)
    const [view, setView] = useState(VIEW_CONFIG)
    const [cords, setCords] = useState<Cords>({lat: 0, long: 0})
    const [image, setImage] = useState<string>('')
    const [profile, setProfile] = useState(null)
    const [manuscripts, setManuscripts] = useState<any[]>([])
    const [manuscript, setManuscript] = useState<any | null>(null)

    const centum = new Centum()

    const [getProfile] = useMutation(getProfileM, {
        optimisticResponse: true,
        onCompleted(data) {
            setProfile(data.getProfile)
        }
    })

    const [manageProfileManuscript] = useMutation(manageProfileManuscriptM, {
        optimisticResponse: true,
        onCompleted(data) {
            ModernAlert(data.manageProfileManuscript)
        }
    })

    useMemo(() => {
        if (context.account_id !== '') {
            getProfile({
                variables: {
                    account_id: id
                }
            })
        }
    }, [context.account_id])

    useMemo(() => {
        if (profile !== null) {
            setImage(profile.main_photo === '' ? ProfilePhoto : profile.main_photo)
            setCords(profile.cords)          
        }
    }, [profile])

    useMemo(() => {
        setView({...view, latitude: cords.lat, longitude: cords.long, zoom: 16})
    }, [cords])

    const onViewProfile = () => {
        centum.go(profile.telegram, 'telegram')
    }
    
    const onLikeManuscript = () => {
        manageProfileManuscript({
            variables: {
                account_id: id, option: 'like', title: '', category: '', words: 0, image: '', dateUp: '', coll_id: manuscript.shortid
            }
        })
    }

    return (
        <>          
            {profile !== null && profile.account_id !== context.account_id &&
                <>
                    <ImageLook src={image} className='photo_item' alt='account photo' />
                    <h1>{profile.username}</h1>
                    
                    <ImageLook onClick={onViewProfile} src={TG_ICON} min={2} max={2} className='icon' alt='telegram link' />

                    <ReactMapGL onClick={e => setCords(centum.mapboxCords(e))} {...view} onViewportChange={(e: any) => setView(e)} mapboxApiAccessToken={token}>
                        <Marker latitude={cords.lat} longitude={cords.long}>
                            <MapPicker type='picker' />
                        </Marker>
                    </ReactMapGL>

                    <DataPagination initialItems={profile.manuscripts} setItems={setManuscripts} label='Manuscripts:' />

                    <div className='items half'>
                        {manuscripts.map(el => 
                            <div onClick={() => setManuscript(el)} className='item panel'>
                                {centum.shorter(el.title)}
                            </div>    
                        )}
                    </div>

                    {manuscript !== null &&
                        <>
                            <CloseIt onClick={() => setManuscript(null)} />

                            {manuscript.image && <ImageLook src={manuscript.image} className='photo_item' alt='manuscript photo' />}

                            <h2>{manuscript.title}</h2>

                            <div className='items small'>
                                <h4 className='pale'>Type: {manuscript.category}</h4>
                                <h4 className='pale'><b>{manuscript.likes}</b> likes</h4>
                            </div>

                            <button onClick={onLikeManuscript}>Like</button>
                        </>
                    }
                </>   
            }

            {profile === null && <Loading />}
        </>
    )
}

export default Profile