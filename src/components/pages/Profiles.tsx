import React, {useState, useMemo, useContext} from 'react'
import ReactMapGL, {Marker} from 'react-map-gl'
import {useQuery} from '@apollo/client'
import {SEARCH_PERCENT, VIEW_CONFIG, token} from '../../env/env'
//@ts-ignore
import Centum from 'centum.js'
//@ts-ignore
import {weekdays_titles} from 'datus.js'
import {gain} from '../../store/localstorage'
import {Context} from '../../context/WebProvider'
import NavigatorWrapper from '../router/NavigatorWrapper'
import Loading from '../UI/Loading'
import MapPicker from '../UI/MapPicker'
import DataPagination from '../UI/DataPagination'
import {getProfilesQ} from '../../graphql/pages/ProfilePageQueries'
import {TownType, Cords} from '../../types/types'

const Profiles: React.FC = () => {
    const {context} = useContext<any>(Context)
    const [view, setView] = useState(VIEW_CONFIG)
    const [towns] = useState<TownType[]>(gain())
    const [profiles, setProfiles] = useState(null)
    const [filtered, setFiltered] = useState<any[]>([])
    const [username, setUsername] = useState<string>('')
    const [isSameRole, setIsSameRole] = useState<boolean>(true)
    const [weekday, setWeekday] = useState<string>(weekdays_titles[0])
    const [region, setRegion] = useState<string>(towns[0].title)
    const [cords, setCords] = useState<Cords>(towns[0].cords)

    const centum = new Centum()

    const {data, loading} = useQuery(getProfilesQ)

    useMemo(() => {
        if (data && context.account_id !== '') {
            setProfiles(data.getProfiles)
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
        if (profiles !== null) {
            let result = profiles.filter(el => el.region === region && el.weekday === weekday)

            if (username !== '') {
                result = result.filter(el => centum.search(el.username, username, SEARCH_PERCENT))
            }
        
            if (isSameRole) {
                result = result.filter(el => el.role === context.role)
            }            

            setFiltered(result)
        }
    }, [profiles, username, weekday, isSameRole, region])
   
    return (
        <>          
            <h1>Best Parents</h1>

            <div className='items small'>   
                <div className='item'>
                    <h4 className='pale'>Fullname</h4>
                    <input value={username} onChange={e => setUsername(e.target.value)} placeholder='Name of user' type='text' />
                </div>

                <div className='item'>
                    <h4 className='pale'>Region</h4>
                    <input value={region} onChange={e => setRegion(e.target.value)} placeholder='Nearest town' type='text' />
                </div>
            </div>
            
            <div onClick={() => setIsSameRole(!isSameRole)} className='text-space'>{isSameRole ? 'My' : 'Other'} Role</div>

            <select value={weekday} onChange={e => setWeekday(e.target.value)}>
                {weekdays_titles.map(el => <option value={el}>{el}</option>)}
            </select>

            <DataPagination initialItems={filtered} setItems={setFiltered} label='Map of users:' />

            {data !== null &&
                <ReactMapGL onClick={e => setCords(centum.mapboxCords(e))} {...view} onViewportChange={(e: any) => setView(e)} mapboxApiAccessToken={token}>
                    <Marker latitude={cords.lat} longitude={cords.long}>
                        <MapPicker type='picker' />
                    </Marker>

                    {filtered.map(el => 
                        <Marker latitude={el.cords.lat} longitude={el.cords.long}>
                            <NavigatorWrapper id={el.account_id} isRedirect={true}>
                                {centum.shorter(el.username)}
                            </NavigatorWrapper>
                        </Marker>     
                    )}
                </ReactMapGL>
            }

            {loading && <Loading />}
        </>
    )
}

export default Profiles