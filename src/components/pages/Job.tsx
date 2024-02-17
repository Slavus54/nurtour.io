import React, {useState, useMemo, useEffect, useContext} from 'react'
import ReactMapGL, {Marker} from 'react-map-gl'
import {useMutation} from '@apollo/client'
import {JOB_ROLES, LEVELS, VIEW_CONFIG, token} from '../../env/env'
//@ts-ignore
import Centum from 'centum.js'
import {Context} from '../../context/WebProvider'
import NavigatorWrapper from '../router/NavigatorWrapper'
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
import JobCommonInfo from '../pieces/JobCommonInfo'
import {ModernAlert} from '../UI/ModernAlert'
import {getJobM, updateJobTaskM, manageJobStatusM, manageJobPhotoM} from '../../graphql/pages/JobPageQueries'
import {CollectionPropsType, Cords} from '../../types/types'

const Job: React.FC<CollectionPropsType> = ({params: {id}}) => {
    const {context} = useContext<any>(Context)
    const [view, setView] = useState(VIEW_CONFIG)
    const [cords, setCords] = useState<Cords>({lat: 0, long: 0})
    const [image, setImage] = useState<string>('')
    const [cost, setCost] = useState<number>(0)
    const [photos, setPhotos] = useState<any[]>([])
    const [photo, setPhoto] = useState<any | null>(null)
    const [tasks, setTasks] = useState<any[]>([])
    const [task, setTask] = useState<any | null>(null)
    const [personality, setPersonality] = useState(null)
    const [job, setJob] = useState(null)
    
    const [state, setState] = useState({
        role: JOB_ROLES[0],
        text: '',
        content: '',
        level: LEVELS[0]
    })

    const centum = new Centum()

    const {role, text, content, level} = state

    const [getJob] = useMutation(getJobM, {
        optimisticResponse: true, 
        onCompleted(data) {
            setJob(data.getJob)
        }
    })

    const [updateJobTask] = useMutation(updateJobTaskM, {
        optimisticResponse: true, 
        onCompleted(data) {
            ModernAlert(data.updateJobTask)
        }
    })

    const [manageJobStatus] = useMutation(manageJobStatusM, {
        optimisticResponse: true, 
        onCompleted(data) {
            ModernAlert(data.manageJobStatus)
        }
    })

    const [manageJobPhoto] = useMutation(manageJobPhotoM, {
        optimisticResponse: true, 
        onCompleted(data) {
            ModernAlert(data.manageJobPhoto)
        }
    })

    useMemo(() => {
        if (context.account_id !== '') {
            getJob({
                variables: {
                    shortid: id
                }
            })
        }
    }, [context.account_id])    

    useEffect(() => {
        if (job !== null) {
            let member = job.members.find(el => centum.search(el.account_id, context.account_id, 100))

            if (member !== undefined) {
                setPersonality(member)   
            }

            setCords(job.cords)
        }
    }, [job])

    useMemo(() => {
        setView({...view, latitude: cords.lat, longitude: cords.long, zoom: 16})
    }, [cords])
  
    useMemo(() => {
        if (job !== null && task !== null) {
            let result: number = centum.part(job.compensation, task.cost)
            
            setState({...state, content: task.content, level: task.level})
            setCost(result)
        }
    }, [task])

    const onUpdateTask = () => {
        updateJobTask({
            variables: {
                username: context.username, id, coll_id: task.id, content, level
            }
        })
    }

    const onManageStatus = (option: string) => {
        manageJobStatus({
            variables: {
                username: context.username, id, option, role
            }
        })
    }

    const onManagePhoto = (option: string) => {
        manageJobPhoto({
            variables: {
                username: context.username, id, option, text, image, coll_id: photo === null ? '' : photo.shortid
            }
        })
    }

    return (
        <>       
            {job !== null && personality === null &&
                <>
                    <h2>Welcome to Job!</h2>

                    <JobCommonInfo dateUp={job.dateUp} time={job.time} />

                    <select value={role} onChange={e => setState({...state, role: e.target.value})}>
                        {JOB_ROLES.map(el => <option value={el}>{el}</option>)}
                    </select>

                    <button onClick={() => onManageStatus('join')}>Join</button>
                </>
            }

            {job !== null && personality !== null &&
                <>
                    <h1>{job.title}</h1>

                    <div className='text-space'>
                        <NavigatorWrapper id={job.account_id} isRedirect={true}>
                            Author
                        </NavigatorWrapper>
                    </div>

                    <JobCommonInfo dateUp={job.dateUp} time={job.time} />

                    <select value={role} onChange={e => setState({...state, role: e.target.value})}>
                        {JOB_ROLES.map(el => <option value={el}>{el}</option>)}
                    </select>

                    <button onClick={() => onManageStatus('update')}>Update</button>

                    <ReactMapGL onClick={e => setCords(centum.mapboxCords(e))} {...view} onViewportChange={(e: any) => setView(e)} mapboxApiAccessToken={token}>
                        <Marker latitude={cords.lat} longitude={cords.long}>
                            <MapPicker type='picker' />
                        </Marker>
                    </ReactMapGL>

                    {task === null ?
                            <>
                                <DataPagination initialItems={job.tasks} setItems={setTasks} label='Job tasks:' />
                                <div className='items half'>
                                    {tasks.map(el => 
                                        <div onClick={() => setTask(el)} className='item panel'>
                                            {centum.shorter(el.content)}
                                        </div>    
                                    )}
                                </div>
                            </>
                        :
                            <>
                                <CloseIt onClick={() => setTask(null)} />

                                {context.username === job.username ? 
                                        <>
                                            <textarea value={content} onChange={e => setState({...state, content: e.target.value})} placeholder='Describe task...' />

                                            <select value={level} onChange={e => setState({...state, level: e.target.value})}>
                                                {LEVELS.map(el => <option value={el}>{el}</option>)}
                                            </select>

                                            <button onClick={onUpdateTask} className='light-btn'>Update</button>
                                        </>
                                    :
                                        <>
                                            <h2>{task.content}</h2>
                                            
                                            <div className='items small'>
                                                <h4 className='pale'>Difficulty: {task.level}</h4>
                                                <h4 className='pale'>Cost: <b>{cost}$</b></h4>
                                            </div>
                                        </>
                                }
                            </>
                    }

                    {photo === null ? 
                            <>
                                <h2>New Photo</h2>

                                <textarea value={text} onChange={e => setState({...state, text: e.target.value})} placeholder='Text...' />

                                <ImageLoader setImage={setImage} />

                                <button onClick={() => onManagePhoto('create')}>Publish</button>

                                <DataPagination initialItems={job.photos} setItems={setPhotos} label='Gallery:' />
                                <div className='items half'>
                                    {photos.map(el => 
                                        <div onClick={() => setPhoto(el)} className='item card'>
                                            {centum.shorter(el.text)}
                                        </div>    
                                    )}
                                </div>
                            </>
                        :
                            <>
                                <CloseIt onClick={() => setPhoto(null)} />

                                {photo.image !== '' && <ImageLook src={photo.image} className='photo_item' alt='photo' />}

                                <h2>{photo.text}</h2>
                                <h4 className='pale'><b>{photo.likes}</b> likes</h4>

                                {photo.name === context.username ? 
                                        <button onClick={() => onManagePhoto('delete')}>Delete</button>
                                    :
<<<<<<< HEAD
                                        <button onClick={() => onManagePhoto('like')}>Like</button>
=======
                                        <LikeButton onClick={() => onManagePhoto('like')} />
>>>>>>> a71f9be (Added masterpiece component, own route of tour's locations with redux on map, small UI changes)
                                }
                            </>
                    }

                    <button onClick={() => onManageStatus('exit')} className='light-btn'>Exit</button>
                </>   
            }

            {job === null && <Loading />}
        </>
    )
}

export default Job