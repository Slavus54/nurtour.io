import React, {useState, useMemo, useEffect, useContext} from 'react'
import ReactMapGL, {Marker} from 'react-map-gl'
import {useMutation} from '@apollo/client'
import {JOB_TYPES, JOB_ROLES, COMPENSATION_TYPES, DAYS_LIMIT, TASK_DEFAULT_COST, AGE_LIMIT, LEVELS, RATING_DEFAULT_VALUE, TIME_BORDERS, COLLECTION_LIMIT, SEARCH_PERCENT, VIEW_CONFIG, token} from '../../env/env'
//@ts-ignore
import Centum from 'centum.js'
//@ts-ignore
import shortid from 'shortid'
//@ts-ignore
import {Datus} from 'datus.js'
import {gain} from '../../store/localstorage'
import {Context} from '../../context/WebProvider'
import MapPicker from '../UI/MapPicker'
import FormPagination from '../UI/FormPagination'
import CounterView from '../UI/CounterView'
import {ModernAlert} from '../UI/ModernAlert'
import {createJobM} from '../../graphql/pages/JobPageQueries'
import {CollectionPropsType, TownType} from '../../types/types'

const CreateJob: React.FC<CollectionPropsType> = ({params}) => {
    const {context} = useContext<any>(Context)
    const [view, setView] = useState(VIEW_CONFIG)
    const [towns] = useState<TownType[]>(gain())
    const [time, setTime] = useState<string>('')
    const [idx, setIdx] = useState<number>(0)
    const [days, setDays] = useState<number>(0)
    const [timer, setTimer] = useState<number>(TIME_BORDERS[0])
    const [percent, setPercent] = useState<number>(RATING_DEFAULT_VALUE)

    const datus = new Datus()

    const [task, setTask] = useState({
        id: shortid.generate().toString(),
        content: '',
        level: LEVELS[0],
        cost: TASK_DEFAULT_COST
    })
    const [state, setState] = useState({
        title: '', 
        category: JOB_TYPES[0], 
        tasks: [],
        ageBorder: 0, 
        compensation: RATING_DEFAULT_VALUE, 
        dateUp: datus.move(), 
        region: towns[0].title, 
        cords: towns[0].cords,
        role: JOB_ROLES[0]
    })

    const centum = new Centum()

    const {title, category, tasks, ageBorder, compensation, dateUp, region, cords, role} = state
    const {id, content, level, cost} = task

    const [createJob] = useMutation(createJobM, {
        optimisticResponse: true,
        onCompleted(data) {
            console.log(data.createJob)
            ModernAlert(data.createJob)
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

    useEffect(() => {
        setState({...state, ageBorder: centum.part(percent, AGE_LIMIT, 0)})
    }, [percent])

    useEffect(() => {
        setTime(centum.time(timer))
    }, [timer])

    useMemo(() => {
        setState({...state, dateUp: datus.move('day', '+', days)})
    }, [days])

    const onTasks = () => {
        if (tasks.length < COLLECTION_LIMIT) {
            setState({...state, tasks: [...tasks, task]})
        }

        setTask({
            id: shortid.generate().toString(),
            content: '',
            level: LEVELS[0],
            cost: TASK_DEFAULT_COST
        })
    }

    const onCreate = () => {
        createJob({
            variables: {
                username: context.username, id: params.id, title, category, tasks, ageBorder, compensation, dateUp, time, region, cords, role
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
                            {JOB_TYPES.map(el => <div onClick={() => setState({...state, category: el})} className={el === category ? 'item label active' : 'item label'}>{el}</div>)}
                        </div> 

                        <h4 className='pale'>Age: <b>{ageBorder} y.o.</b></h4>
                        <input value={percent} onChange={e => setPercent(parseInt(e.target.value))} type='range' step={1} />

                        <CounterView num={days} setNum={setDays} part={1} min={0} max={DAYS_LIMIT}>
                            Date: {dateUp}
                        </CounterView>
                    </>,
                    <>
                        <h4 className='pale'>Tasks ({tasks.length}/{COLLECTION_LIMIT}) and Client's Compensation (%)</h4>

                        <textarea value={content} onChange={e => setTask({...task, content: e.target.value})} placeholder='Describe task...' />

                        <select value={level} onChange={e => setTask({...task, level: e.target.value})}>
                            {LEVELS.map(el => <option value={el}>{el}</option>)}
                        </select>

                        <h4 className='pale'>How much $ it costs?</h4>
                        <input value={cost} onChange={e => setTask({...task, cost: parseInt(e.target.value)})} placeholder='Cost of task' type='text' />

                        {isNaN(cost) ? <button onClick={() => setTask({...task, cost: TASK_DEFAULT_COST})}>Reset</button> : <button onClick={onTasks}>Add</button>}

                        <div className='items small'>
                            {COMPENSATION_TYPES.map(el => <div onClick={() => setState({...state, compensation: el})} className={el === compensation ? 'item label active' : 'item label'}>{el}</div>)}
                        </div> 
                    </>,
                    <>
                        <h4 className='pale'>Where it located?</h4>
                        <input value={region} onChange={e => setState({...state, region: e.target.value})} placeholder='Nearest town' type='text' />

                        <CounterView num={timer} setNum={setTimer} part={30} min={TIME_BORDERS[0]} max={TIME_BORDERS[1]}>
                            Start in {time}
                        </CounterView>

                        <select value={role} onChange={e => setState({...state, role: e.target.value})}>
                            {JOB_ROLES.map(el => <option value={el}>{el}</option>)}
                        </select>

                        <ReactMapGL onClick={e => setState({...state, cords: centum.mapboxCords(e)})} {...view} onViewportChange={(e: any) => setView(e)} mapboxApiAccessToken={token}>
                            <Marker latitude={cords.lat} longitude={cords.long}>
                                <MapPicker type='picker' />
                            </Marker>
                        </ReactMapGL>  
                    </>
                ]} 
            >
                <h1>New Job</h1>
            </FormPagination>

            <button onClick={onCreate}>Create</button>
        </div>
    )
}

export default CreateJob