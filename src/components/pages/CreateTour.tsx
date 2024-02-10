import React, {useState, useMemo, useContext} from 'react'
import ReactMapGL, {Marker} from 'react-map-gl'
import {useMutation} from '@apollo/client'
import {TOUR_TYPES, SEARCH_PERCENT, VIEW_CONFIG, token} from '../../env/env'
//@ts-ignore
import Centum from 'centum.js'
import {gain} from '../../store/localstorage'
import {Context} from '../../context/WebProvider'
import MapPicker from '../UI/MapPicker'
import FormPagination from '../UI/FormPagination'
import {ModernAlert} from '../UI/ModernAlert'
import {createTourM} from '../../graphql/pages/TourPageQueries'
import {CollectionPropsType, TownType} from '../../types/types'

const CreateTour: React.FC<CollectionPropsType> = ({params}) => {
    const {context} = useContext<any>(Context)
    const [view, setView] = useState(VIEW_CONFIG)
    const [towns] = useState<TownType[]>(gain())
    const [idx, setIdx] = useState<number>(0)
    const [state, setState] = useState({
        title: '', 
        category: TOUR_TYPES[0], 
        region: towns[0].title, 
        cords: towns[0].cords,
        rating: 50
    })

    const centum = new Centum()

    const {title, category, region, cords, rating} = state

    const [createTour] = useMutation(createTourM, {
        optimisticResponse: true,
        onCompleted(data) {
            console.log(data.createTour)
            ModernAlert(data.createTour)
        }
    })

    useMemo(() => {
        if (region !== '') {
            let result = towns.find(el => centum.search(el.title, region, SEARCH_PERCENT)) 
    
            if (result !== undefined) {
                setState({...state, region: result.title, cords: result.cords})
            }           
        }
    }, [region])

    useMemo(() => {
        setView({...view, latitude: cords.lat, longitude: cords.long, zoom: 16})
    }, [cords])

    const onCreate = () => {
        createTour({
            variables: {
                username: context.username, id: params.id, title, category, region, cords, rating
            }
        })
    }

    return (
        <div className='main'>          
            <FormPagination num={idx} setNum={setIdx} items={[
                    <>
                        <h4 className='pale'>Title</h4>
                        <input value={title} onChange={e => setState({...state, title: e.target.value})} placeholder='Title of tour' type='text' />
                
                        <h4 className='pale'>Type</h4>
                        <div className='items small'>
                            {TOUR_TYPES.map(el => <div onClick={() => setState({...state, category: el})} className={el === category ? 'item label active' : 'item label'}>{el}</div>)}
                        </div> 

                        <h4 className='pale'>Rating: <b>{rating}%</b></h4>
                        <input value={rating} onChange={e => setState({...state, rating: parseInt(e.target.value)})} type='range' step={1} />
                    </>,
                    <>
                        <h4 className='pale'>Where it located?</h4>
                        <input value={region} onChange={e => setState({...state, region: e.target.value})} placeholder='Nearest town' type='text' />
                        <ReactMapGL onClick={e => setState({...state, cords: centum.mapboxCords(e)})} {...view} onViewportChange={(e: any) => setView(e)} mapboxApiAccessToken={token}>
                            <Marker latitude={cords.lat} longitude={cords.long}>
                                <MapPicker type='picker' />
                            </Marker>
                        </ReactMapGL>  
                    </>
                ]} 
            >
                <h1>New Tour</h1>
            </FormPagination>

            <button onClick={onCreate}>Create</button>
        </div>
    )
}

export default CreateTour