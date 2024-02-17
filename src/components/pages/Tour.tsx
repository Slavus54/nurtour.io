import React, {useState, useMemo, useContext} from 'react'
import ReactMapGL, {Marker} from 'react-map-gl'
import {useMutation} from '@apollo/client'
<<<<<<< HEAD
import {LOCATION_TYPES, LEVELS, VIEW_CONFIG, token} from '../../env/env'
//@ts-ignore
import Centum from 'centum.js'
import {Context} from '../../context/WebProvider'
=======
import {useDispatch} from 'react-redux'
//@ts-ignore
import Centum from 'centum.js'
import {LOCATION_TYPES, LEVELS, VIEW_CONFIG, token} from '../../env/env'
import {Context} from '../../context/WebProvider'
import {append} from '../../store/route/RouteSlice'
>>>>>>> a71f9be (Added masterpiece component, own route of tour's locations with redux on map, small UI changes)
import Loading from '../UI/Loading'
import MapPicker from '../UI/MapPicker'
import ImageLoader from '../UI/ImageLoader'
import ImageLook from '../UI/ImageLook'
import CloseIt from '../UI/CloseIt'
import DataPagination from '../UI/DataPagination'
<<<<<<< HEAD
=======
import LikeButton from '../UI/LikeButton'
>>>>>>> a71f9be (Added masterpiece component, own route of tour's locations with redux on map, small UI changes)
import {ModernAlert} from '../UI/ModernAlert'
import {getTourM, updateTourRatingM, manageTourLocationM, makeTourFactM} from '../../graphql/pages/TourPageQueries'
import {CollectionPropsType, Cords} from '../../types/types'

const Tour: React.FC<CollectionPropsType> = ({params: {id}}) => {
    const {context} = useContext<any>(Context)
    const [view, setView] = useState(VIEW_CONFIG)
    const [cords, setCords] = useState<Cords>({lat: 0, long: 0})
    const [image, setImage] = useState<string>('')
    const [points, setPoints] = useState<number>(0)
    const [distance, setDistance] = useState<number>(0)
    const [locations, setLocations] = useState<any[]>([])
    const [location, setLocation] = useState<any | null>(null)
    const [fact, setFact] = useState<any | null>(null)

    const [tour, setTour] = useState(null)
    
    const [state, setState] = useState({
        title: '',
        category: LOCATION_TYPES[0],
        text: '',
        level: LEVELS[0],
        isTrue: true,
        rating: 50
    })

    const centum = new Centum()
<<<<<<< HEAD
=======
    const dispatch = useDispatch()
>>>>>>> a71f9be (Added masterpiece component, own route of tour's locations with redux on map, small UI changes)

    const {title, category, text, level, isTrue, rating} = state

    const [getTour] = useMutation(getTourM, {
        optimisticResponse: true,
        onCompleted(data) {
            console.log(data.getTour)
            setTour(data.getTour)
        }
    })

    const [updateTourRating] = useMutation(updateTourRatingM, {
        optimisticResponse: true,
        onCompleted(data) {
            ModernAlert(data.updateTourRating)
        }
    })

    const [manageTourLocation] = useMutation(manageTourLocationM, {
        optimisticResponse: true,
        onCompleted(data) {
            ModernAlert(data.manageTourLocation)
        }
    })

    const [makeTourFact] = useMutation(makeTourFactM, {
        optimisticResponse: true,
        onCompleted(data) {
            ModernAlert(data.makeTourFact)
        }
    })

    useMemo(() => {
        if (context.account_id !== '') {
            getTour({
                variables: {
                    shortid: id
                }
            })
        }
    }, [context.account_id])

    useMemo(() => {
        if (tour !== null) {
            setState({...state, rating: tour.rating})
            setCords(tour.cords)
        }
    }, [tour])

    useMemo(() => {
        setView({...view, latitude: cords.lat, longitude: cords.long, zoom: 16})
    }, [cords])

    useMemo(() => {
        setState({...state, isTrue: true})
    }, [fact])

    useMemo(() => {
        if (tour !== null && location !== null) {
            let result = centum.haversine([tour.cords.lat, tour.cords.long, location.cords.lat, location.cords.long], 1)

            setDistance(result)
        }
    }, [location]) 

    const onFact = () => {
        let result = centum.random(tour.facts)?.value

        if (result !== undefined) {
            setFact(result)
        }

        if (fact !== null) {
            let award = LEVELS.indexOf(fact.level) + 1

            if (fact.isTrue === isTrue) {
                setPoints(points + award)
            }
        }
    }

<<<<<<< HEAD
=======
    const onAppendLocation = () => {
        dispatch(append(location))
    }

>>>>>>> a71f9be (Added masterpiece component, own route of tour's locations with redux on map, small UI changes)
    const onUpdateRating = () => {
        updateTourRating({
            variables: {
                username: context.username, id, rating
            }
        })
    }

    const onManageLocation = (option: string) => {
        manageTourLocation({
            variables: {
                username: context.username, id, option, title, category, image, cords, coll_id: location === null ? '' : location.shortid
            }
        })
    }

    const onMakeFact = () => {
        makeTourFact({
            variables: {
                username: context.username, id, text, level, isTrue
            }
        })
    }

    return (
        <>          
            {tour !== null &&
                <>
                    <h1>{tour.title}</h1>

                    <div className='items small'>
                        <h4 className='pale'>Type: {tour.category}</h4>
                        <h4 className='pale'>Region: {tour.region}</h4>
                    </div>  

                    <h4 className='pale'>Rating: <b>{rating}%</b></h4>
                    <input value={rating} onChange={e => setState({...state, rating: parseInt(e.target.value)})} type='range' step={1} />

                    <button onClick={onUpdateRating} className='light-btn'>Update</button>

                    {location === null ? 
                            <>
                                <h2>New Location</h2>

                                <input value={title} onChange={e => setState({...state, title: e.target.value})} placeholder='Title of location' type='text' />

                                <h4 className='pale'>Type</h4>
                                <div className='items small'>
                                    {LOCATION_TYPES.map(el => <div onClick={() => setState({...state, category: el})} className={el === category ? 'item label active' : 'item label'}>{el}</div>)}
                                </div> 

                                <ImageLoader setImage={setImage} />

                                <button onClick={() => onManageLocation('create')}>Create</button>

                                <DataPagination initialItems={tour.locations} setItems={setLocations} label='Locations on map:' />
                            </>
                        :
                            <>
                                <CloseIt onClick={() => setLocation(null)} />

                                {location.image !== '' && <ImageLook src={location.image} className='photo_item' alt='location photo' />}

                                <h2>{location.title} ({distance}m)</h2>

<<<<<<< HEAD
=======
                                <button onClick={onAppendLocation} className='light-btn'>To Route</button>

>>>>>>> a71f9be (Added masterpiece component, own route of tour's locations with redux on map, small UI changes)
                                <div className='items small'>
                                    <h4 className='pale'>Type: {location.category}</h4>
                                    <h4 className='pale'><b>{location.likes}</b> likes</h4>
                                </div>

                                {location.name === context.username ? 
                                        <button onClick={() => onManageLocation('delete')}>Delete</button>
                                    :
<<<<<<< HEAD
                                        <button onClick={() => onManageLocation('like')}>Like</button>
=======
                                        <LikeButton onClick={() => onManageLocation('like')} />
>>>>>>> a71f9be (Added masterpiece component, own route of tour's locations with redux on map, small UI changes)
                                }
                            </>
                    }

                    <ReactMapGL onClick={e => setCords(centum.mapboxCords(e))} {...view} onViewportChange={(e: any) => setView(e)} mapboxApiAccessToken={token}>
                        <Marker latitude={cords.lat} longitude={cords.long}>
                            <MapPicker type='picker' />
                        </Marker>

                        {locations.map(el => 
                            <Marker onClick={() => setLocation(el)} latitude={el.cords.lat} longitude={el.cords.long}>
                                {centum.shorter(el.title)}
                            </Marker>     
                        )}
                    </ReactMapGL>

                    {fact === null ?
                            <>
                                <h2>New Fact</h2>

                                <textarea value={text} onChange={e => setState({...state, text: e.target.value})} placeholder='Text of fact...' />

                                <select value={level} onChange={e => setState({...state, level: e.target.value})}>
                                    {LEVELS.map(el => <option value={el}>{el}</option>)}
                                </select>

                                <div onClick={() => setState({...state, isTrue: !isTrue})} className='text-space'>{isTrue ? 'Truth' : 'Lie'}</div>

                                <button onClick={onMakeFact}>Publish</button>

                                <div className='items small'>
                                    <h4 className='pale'>Difficulty: {level}</h4>
                                    <h4 className='pale'>Points: <b>{points}</b></h4>
                                </div>
                            
                                <button onClick={onFact}>Generate</button>
                            </>
                        :
                            <>
                                <CloseIt onClick={() => setFact(null)} />

                                <h2>{fact.text}</h2>
                                <h4 className='pale'>Difficulty: {fact.level}</h4>

                                <button onClick={onFact}>Check</button>
                            </>
                    }
                </>
            }

            {tour === null && <Loading />}
        </>
    )
}

export default Tour