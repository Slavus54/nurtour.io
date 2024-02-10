import React, {useState, useMemo, useContext} from 'react'
import ReactMapGL, {Marker} from 'react-map-gl'
import {useQuery} from '@apollo/client'
import {TOUR_TYPES, SEARCH_PERCENT, VIEW_CONFIG, token} from '../../env/env'
//@ts-ignore
import Centum from 'centum.js'
import {gain} from '../../store/localstorage'
import {Context} from '../../context/WebProvider'
import NavigatorWrapper from '../router/NavigatorWrapper'
import Loading from '../UI/Loading'
import MapPicker from '../UI/MapPicker'
import DataPagination from '../UI/DataPagination'
import {getToursQ} from '../../graphql/pages/TourPageQueries'
import {TownType, Cords} from '../../types/types'

const Tours: React.FC = () => {
    const {context} = useContext<any>(Context)
    const [view, setView] = useState(VIEW_CONFIG)
    const [towns] = useState<TownType[]>(gain())
    const [tours, setTours] = useState(null)
    const [filtered, setFiltered] = useState<any[]>([])
    const [title, setTitle] = useState<string>('')
    const [category, setCategory] = useState<string>(TOUR_TYPES[0])
    const [region, setRegion] = useState<string>(towns[0].title)
    const [cords, setCords] = useState<Cords>(towns[0].cords)

    const centum = new Centum()

    const {data, loading} = useQuery(getToursQ)

    useMemo(() => {
        if (data && context.account_id !== '') {
            setTours(data.getTours)
        }
    }, [data])

    useMemo(() => {
        if (region !== '') {
            let result = towns.find(el => centum.search(el.title, region, SEARCH_PERCENT)) 
    
            if (result !== undefined) {
                setRegion(result.title)
                setCords(result.cords)
            }           
        }
    }, [region])

    useMemo(() => {
        setView({...view, latitude: cords.lat, longitude: cords.long, zoom: 16})
    }, [cords])

    useMemo(() => {
        if (tours !== null) {
            let result = tours.filter(el => el.region === region)

            if (title !== '') {
                result = result.filter(el => centum.search(el.title, title, SEARCH_PERCENT))
            }
        
            result = result.filter(el => el.category === category)

            setFiltered(result)
        }
    }, [tours, title, category, region])
   
    return (
        <>          
            <h1>Find new tour</h1>

            <div className='items small'>   
                <div className='item'>
                    <h4 className='pale'>Title</h4>
                    <input value={title} onChange={e => setTitle(e.target.value)} placeholder='Title of tour' type='text' />
                </div>

                <div className='item'>
                    <h4 className='pale'>Region</h4>
                    <input value={region} onChange={e => setRegion(e.target.value)} placeholder='Nearest town' type='text' />
                </div>
            </div>
            

            <h4 className='pale'>Type</h4>
            <div className='items small'>
                {TOUR_TYPES.map(el => <div onClick={() => setCategory(el)} className={el === category ? 'item label active' : 'item label'}>{el}</div>)}
            </div> 

            <DataPagination initialItems={filtered} setItems={setFiltered} label='Map of tours:' />

            {data !== null &&
                <ReactMapGL onClick={e => setCords(centum.mapboxCords(e))} {...view} onViewportChange={(e: any) => setView(e)} mapboxApiAccessToken={token}>
                    <Marker latitude={cords.lat} longitude={cords.long}>
                        <MapPicker type='picker' />
                    </Marker>

                    {filtered.map(el => 
                        <Marker latitude={el.cords.lat} longitude={el.cords.long}>
                            <NavigatorWrapper url={`/tour/${el.shortid}`} isRedirect={false}>
                                {centum.shorter(el.title)}
                            </NavigatorWrapper>
                        </Marker>     
                    )}
                </ReactMapGL>
            }

            {loading && <Loading />}
        </>
    )
}

export default Tours