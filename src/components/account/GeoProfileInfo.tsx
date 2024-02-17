import {useState, useMemo, useEffect} from 'react'
import ReactMapGL, {Marker} from 'react-map-gl'
import {useMutation} from '@apollo/client'
<<<<<<< HEAD
import {SEARCH_PERCENT, VIEW_CONFIG, token} from '../../env/env'
//@ts-ignore
import Centum from 'centum.js'
import {gain} from '../../store/localstorage'
=======
import {useDispatch, useSelector} from 'react-redux'
//@ts-ignore
import Centum from 'centum.js'
import {SEARCH_PERCENT, VIEW_CONFIG, token} from '../../env/env'
import {gain} from '../../store/localstorage'
import {init} from '../../store/route/RouteSlice'
import type {RouteState} from '../../store/store'
>>>>>>> a71f9be (Added masterpiece component, own route of tour's locations with redux on map, small UI changes)
import MapPicker from '../UI/MapPicker'
import {ModernAlert} from '../UI/ModernAlert'
import {updateProfileGeoInfoM} from '../../graphql/profile/ProfileQueries'
import {AccountPageComponentProps, Cords, TownType} from '../../types/types'

const GeoProfileInfo = ({profile, context} : AccountPageComponentProps) => {
    const [view, setView] = useState(VIEW_CONFIG)
<<<<<<< HEAD
=======
    const locations = useSelector((state: RouteState) => state.route.locations)
>>>>>>> a71f9be (Added masterpiece component, own route of tour's locations with redux on map, small UI changes)
    const [towns] = useState<TownType[]>(gain())
    const [cords, setCords] = useState<Cords>({lat: profile.cords.lat, long: profile.cords.long})
    const [state, setState] = useState({
        region: profile.region
    })

    const centum = new Centum()
<<<<<<< HEAD

    const {region} = state
  
    
=======
    const dispatch = useDispatch()

    const {region} = state
>>>>>>> a71f9be (Added masterpiece component, own route of tour's locations with redux on map, small UI changes)

    const [updateProfileGeoInfo] = useMutation(updateProfileGeoInfoM, {
        optimisticResponse: true,
        onCompleted(data) {
            ModernAlert(data.updateProfileGeoInfo)   
        }
    })

    useEffect(() => {
        if (region !== '' && region !== profile.region) {
            let result = towns.find(el => centum.search(el.title, region, SEARCH_PERCENT))

            if (result !== undefined) {
                setState({...state, region: result.title})
                setCords(result.cords)
            }
        }
    }, [region])

    useMemo(() => {
        setView({...view, latitude: cords.lat, longitude: cords.long, zoom: 17})
    }, [cords])

<<<<<<< HEAD
=======
    const onReset = () => {
        dispatch(init())
        onNavigate(profile.cords)
    }

    const onNavigate = (value: Cords) => {
        setCords(value)
    }

>>>>>>> a71f9be (Added masterpiece component, own route of tour's locations with redux on map, small UI changes)
    const onUpdate = () => {
        updateProfileGeoInfo({
            variables: {
                account_id: context.account_id, region, cords
            }
        })
    }
 
    return (
        <>         
            <input value={region} onChange={e => setState({...state, region: e.target.value})} placeholder='Nearest town' type='text' />
            
            <ReactMapGL onClick={e => setCords(centum.mapboxCords(e))} {...view} onViewportChange={(e: any) => setView(e)} mapboxApiAccessToken={token}>
                <Marker latitude={cords.lat} longitude={cords.long}>
                    <MapPicker type='picker' />
                </Marker>
<<<<<<< HEAD
            </ReactMapGL>      
            <button onClick={onUpdate}>Update</button>
=======

                {locations.map(el => 
                    <Marker latitude={el.cords.lat} longitude={el.cords.long}>
                        {centum.shorter(el.title)}
                    </Marker>
                )}
            </ReactMapGL>      

            <button onClick={onUpdate}>Update</button>

            <h2>Route's Locations</h2>
            <div className='items half'>
                {locations.map(el => 
                    <div onClick={() => onNavigate(el.cords)} className='item panel'>
                        {centum.shorter(el.title)}
                        <h5 className='pale'>{el.category}</h5>
                    </div>    
                )}
            </div>
            <button onClick={onReset} className='light-btn'>Reset</button>
>>>>>>> a71f9be (Added masterpiece component, own route of tour's locations with redux on map, small UI changes)
        </> 
    )
}

export default GeoProfileInfo