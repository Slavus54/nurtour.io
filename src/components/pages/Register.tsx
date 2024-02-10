import {useState, useMemo, useContext} from 'react'
import ReactMapGL, {Marker} from 'react-map-gl'
import {useMutation} from '@apollo/client'
import {ROLES, SEARCH_PERCENT, VIEW_CONFIG, token} from '../../env/env'
//@ts-ignore
import Centum from 'centum.js'
//@ts-ignore
import {weekdays_titles} from 'datus.js'
import {gain} from '../../store/localstorage'
import {Context} from '../../context/WebProvider'
import ImageLoader from '../UI/ImageLoader'
import MapPicker from '../UI/MapPicker'
import FormPagination from '../UI/FormPagination'
import {registerM} from '../../graphql/profile/ProfileQueries'
import {TownType} from '../../types/types'

const Register = () => {
    const {change_context} = useContext<any>(Context)
    const [view, setView] = useState(VIEW_CONFIG)
    const [towns] = useState<TownType[]>(gain())
    const [image, setImage] = useState<string>('')
    const [idx, setIdx] = useState<number>(0)
    const [state, setState] = useState({
        username: '', 
        security_code: '', 
        telegram: '',
        role: ROLES[0],
        weekday: weekdays_titles[0],
        region: towns[0].title, 
        cords: towns[0].cords
    })

    const centum = new Centum()

    const {username, security_code, telegram, role, weekday, region, cords} = state

    const [register] = useMutation(registerM, {
        optimisticResponse: true,
        onCompleted(data) {
            console.log(data.register)
            change_context('update', data.register, 1)
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
        register({
            variables: {
                username, security_code, telegram, role, weekday, region, cords, main_photo: image
            }
        })
    }

    return (
        <div className='main'>          
            <FormPagination num={idx} setNum={setIdx} items={[
                    <>
                        <h4 className='pale'>Fullname</h4>
                        <input value={username} onChange={e => setState({...state, username: e.target.value})} placeholder='Enter your name' type='text' />
                
                        <h4 className='pale'>Security</h4>
                        <input value={security_code} onChange={e => setState({...state, security_code: e.target.value})} placeholder='Security code' type='text' />  
                    </>,
                    <>
                        <h4 className='pale'>Common information</h4>
                        <input value={telegram} onChange={e => setState({...state, telegram: e.target.value})} placeholder='Telegram tag' type='text' />
                        <div className='items small'>
                            <select value={role} onChange={e => setState({...state, role: e.target.value})}>
                                {ROLES.map(el => <option value={el}>{el}</option>)}
                            </select>
                            <select value={weekday} onChange={e => setState({...state, weekday: e.target.value})}>
                                {weekdays_titles.map(el => <option value={el}>{el}</option>)}
                            </select>
                        </div>

                        <ImageLoader setImage={setImage} />
                    </>,
                    <>
                        <h4 className='pale'>Where are you?</h4>
                        <input value={region} onChange={e => setState({...state, region: e.target.value})} placeholder='Nearest town' type='text' />
                        <ReactMapGL onClick={e => setState({...state, cords: centum.mapboxCords(e)})} {...view} onViewportChange={(e: any) => setView(e)} mapboxApiAccessToken={token}>
                            <Marker latitude={cords.lat} longitude={cords.long}>
                                <MapPicker type='picker' />
                            </Marker>
                        </ReactMapGL>  
                    </>
                ]} 
            >
                <h1>New Account</h1>
            </FormPagination>

            <button onClick={onCreate}>Create</button>
        </div>
    )
}

export default Register