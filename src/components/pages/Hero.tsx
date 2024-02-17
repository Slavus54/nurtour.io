import React, {useState, useMemo, useEffect, useContext} from 'react'
import {useMutation} from '@apollo/client'
import {QUOTE_TYPES, LEVELS} from '../../env/env'
//@ts-ignore
import Centum from 'centum.js'
import {Context} from '../../context/WebProvider'
import Loading from '../UI/Loading'
import DataPagination from '../UI/DataPagination'
import ImageLoader from '../UI/ImageLoader'
import ImageLook from '../UI/ImageLook'
import CloseIt from '../UI/CloseIt'
<<<<<<< HEAD
=======
import LikeButton from '../UI/LikeButton'
>>>>>>> a71f9be (Added masterpiece component, own route of tour's locations with redux on map, small UI changes)
import {ModernAlert} from '../UI/ModernAlert'
import {getHeroM, updateHeroPhotoM, makeHeroAchievementM, manageHeroQuoteM} from '../../graphql/pages/HeroPageQueries'
import {CollectionPropsType} from '../../types/types'

const Hero: React.FC<CollectionPropsType> = ({params: {id}}) => {
    const {context} = useContext<any>(Context)
    const [image, setImage] = useState<string>('')
    const [achievements, setAchievements] = useState<any[]>([])
    const [achievement, setAchievement] = useState<any | null>(null)
    const [quote, setQuote] = useState<any | null>(null)
    const [hero, setHero] = useState(null)
    const [state, setState] = useState({
        text: '',
        category: QUOTE_TYPES[0],
        title: '',
        position: '',
        level: LEVELS[0]
    })

    const centum = new Centum()

    const {text, category, title, position, level} = state

    const [getHero] = useMutation(getHeroM, {
        optimisticResponse: true,
        onCompleted(data) {
            setHero(data.getHero)
        }
    })

    const [updateHeroPhoto] = useMutation(updateHeroPhotoM, {
        optimisticResponse: true,
        onCompleted(data) {
            ModernAlert(data.updateHeroPhoto)
        }
    })

    const [makeHeroAchievement] = useMutation(makeHeroAchievementM, {
        optimisticResponse: true,
        onCompleted(data) {
            ModernAlert(data.makeHeroAchievement)
        }
    })

    const [manageHeroQuote] = useMutation(manageHeroQuoteM, {
        optimisticResponse: true,
        onCompleted(data) {
            ModernAlert(data.manageHeroQuote)
        }
    })

    useEffect(() => {
        if (context.account_id !== '') {
            getHero({
                variables: {
                    shortid: id
                }
            })
        }
    }, [context.account_id])

    useMemo(() => {
        if (hero !== null) {
            setImage(hero.image)
        }
    }, [hero])

    const onQuote = () => {
        let result = centum.random(hero.quotes)?.value

        if (result !== undefined) {
            setQuote(result)
        }
    }
    
    const onUpdatePhoto = () => {
        updateHeroPhoto({
            variables: {
                username: context.username, id, image
            }
        })
    }

    const onMakeAchievement = () => {
        makeHeroAchievement({
            variables: {
                username: context.username, id, title, position, level
            }
        })
    }

    const onManageQuote = (option: string) => {
        manageHeroQuote({
            variables: {
                username: context.username, id, option, text, category, coll_id: quote === null ? '' : quote.shortid
            }
        })
    }

    return (
        <>          
            {hero !== null &&
                <>
                    {image !== '' && <ImageLook src={image} className='photo_item' alt='hero photo' />}

                    <h1>{hero.fullname}</h1>

                    <div className='items small'>
                        <h4 className='pale'>Country: {hero.country}</h4>
                        <h4 className='pale'>Century: {hero.century}</h4>
                    </div>

                    <ImageLoader setImage={setImage} />

                    <button onClick={onUpdatePhoto} className='light-btn'>Update</button>

                    {quote === null ?
                            <>
                                <h2>New Quote</h2>

                                <textarea value={text} onChange={e => setState({...state, text: e.target.value})} placeholder='Text...' />
                                
                                <h4 className='pale'>Theme</h4>
                                <div className='items small'>
                                    {QUOTE_TYPES.map(el => <div onClick={() => setState({...state, category: el})} className={el === category ? 'item label active' : 'item label'}>{el}</div>)}
                                </div>

                                <div className='items small'>
                                    <button onClick={onQuote}>Generate</button>
                                    <button onClick={() => onManageQuote('create')}>Publish</button>
                                </div>
                            </>
                        :
                            <>
                                <CloseIt onClick={() => setQuote(null)} />

                                <h2>{quote.text}</h2>

                                <div className='items small'>
                                    <h4 className='pale'>Theme: {quote.category}</h4>
                                    <h4 className='pale'><b>{quote.likes}</b> likes</h4>
                                </div>

                                {context.username === quote.name ?
                                        <button onClick={() => onManageQuote('delete')}>Delete</button>
                                    :
<<<<<<< HEAD
                                        <button onClick={() => onManageQuote('like')}>Like</button>
=======
                                        <LikeButton onClick={() => onManageQuote('like')} />
>>>>>>> a71f9be (Added masterpiece component, own route of tour's locations with redux on map, small UI changes)
                                }
                            </>
                    }

                    {achievement === null ? 
                            <>
                                <h2>New Achievement</h2>
                                <textarea value={title} onChange={e => setState({...state, title: e.target.value})} placeholder='What had been achieved?' />

                                <select value={level} onChange={e => setState({...state, level: e.target.value})}>
                                    {LEVELS.map(el => <option value={el}>{el}</option>)}
                                </select> 

                                <h4 className='pale'>Profession</h4>
                                <div className='items small'>
                                    {hero.positions.map(el => <div onClick={() => setState({...state, position: el})} className={el === position ? 'item label active' : 'item label'}>{el}</div>)}
                                </div> 

                                <button onClick={onMakeAchievement}>Create</button>

                                <DataPagination initialItems={hero.achievements} setItems={setAchievements} label='List of achievements:' />

                                <div className='items half'>
                                    {achievements.map(el => 
                                        <div onClick={() => setAchievement(el)} className='item panel'>
                                            {centum.shorter(el.title)}
                                        </div>    
                                    )}
                                </div>
                            </>
                        :
                            <>
                                <CloseIt onClick={() => setAchievement(null)} />

                                <h2>{achievement.title}</h2>

                                <div className='items small'>
                                    <h4 className='pale'>Position: {achievement.position}</h4>
                                    <h4 className='pale'>Influence: {achievement.level}</h4>
                                </div>
                            </>
                    }
                </>
            }

            {hero === null && <Loading />}
        </>
    )
}

export default Hero