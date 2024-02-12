import React, {useState, useMemo, useEffect, useContext} from 'react'
import {useMutation} from '@apollo/client'
import {HEALTH_TYPES, RATING_DEFAULT_VALUE, CALORIES_BASE} from '../../env/env'
//@ts-ignore
import Centum from 'centum.js'
//@ts-ignore
import {Datus} from 'datus.js'
import {Context} from '../../context/WebProvider'
import Loading from '../UI/Loading'
import ImageLoader from '../UI/ImageLoader'
import ImageLook from '../UI/ImageLook'
import CloseIt from '../UI/CloseIt'
import DataPagination from '../UI/DataPagination'
import {ModernAlert} from '../UI/ModernAlert'
import {getRecipeM, updateRecipeInfoM, updateRecipeStepM, makeRecipeHealthM, manageRecipeCookingM} from '../../graphql/pages/RecipePageQueries'
import {CollectionPropsType} from '../../types/types'

const Recipes: React.FC<CollectionPropsType> = ({params: {id}}) => {
    const {context} = useContext<any>(Context)
    const [image, setImage] = useState<string>('')
    const [caloriesPercent, setCaloriesPercent] = useState<number>(0)
    const [steps, setSteps] = useState<any[]>([])
    const [step, setStep] = useState<any | null>(null)
    const [healthes, setHealthes] = useState<any[]>([])
    const [cookings, setCookings] = useState<any[]>([])
    const [cooking, setCooking] = useState<any | null>(null)

    const [recipe, setRecipe] = useState(null)

    const datus = new Datus()

    const [state, setState] = useState({
        text: '',
        dateUp: datus.move(),
        ingredient: '',
        category: HEALTH_TYPES[0],
        percent: RATING_DEFAULT_VALUE,
        link: '',
        rating: RATING_DEFAULT_VALUE,
        content: ''
    })

    const centum = new Centum()

    const {text, dateUp, ingredient, category, percent, link, rating, content} = state

    const [getRecipe] = useMutation(getRecipeM, {
        optimisticResponse: true,
        onCompleted(data) {
            setRecipe(data.getRecipe)
        }
    })

    const [updateRecipeInfo] = useMutation(updateRecipeInfoM, {
        optimisticResponse: true,
        onCompleted(data) {
            ModernAlert(data.updateRecipeInfo)
        }
    })

    const [updateRecipeStep] = useMutation(updateRecipeStepM, {
        optimisticResponse: true,
        onCompleted(data) {
            ModernAlert(data.updateRecipeStep)
        }
    })

    const [makeRecipeHealth] = useMutation(makeRecipeHealthM, {
        optimisticResponse: true,
        onCompleted(data) {
            ModernAlert(data.makeRecipeHealth)
        }
    })

    const [manageRecipeCooking] = useMutation(manageRecipeCookingM, {
        optimisticResponse: true,
        onCompleted(data) {
            ModernAlert(data.manageRecipeCooking)
        }
    })

    useMemo(() => {
        if (context.account_id !== '') {
            getRecipe({
                variables: {
                    shortid: id
                }
            })
        }
    }, [context.account_id])
   
    useMemo(() => {
        if (recipe !== null) {
            let result: number = centum.percent(recipe.calories, CALORIES_BASE, 1)

            setCaloriesPercent(result)
            setState({...state, link: recipe.link, rating: recipe.rating})
        }
    }, [recipe])

    useEffect(() => {
        setState({...state, content: step === null ? '' : step.content})
    }, [step])

    const onUpdateInfo = () => {
        updateRecipeInfo({
            variables: {
                username: context.username, id, link, rating
            }
        })
    }

    const onUpdateStep = () => {
        updateRecipeStep({
            variables: {
                username: context.username, id, coll_id: step.id, content
            }
        })
    }

    const onMakeHealth = () => {
        makeRecipeHealth({
            variables: {
                username: context.username, id, ingredient, category, percent   
            }
        })
    }

    const onManageCooking = (option: string) => {
        manageRecipeCooking({
            variables: {
                username: context.username, id, option, text, image, dateUp, coll_id: cooking === null ? '' : cooking.shortid 
            }
        })
    }   

    return (
        <>          
            {recipe !== null &&
                <>
                    <h1>{recipe.title}</h1>

                    <div className='items small'>
                        <h4 className='pale'>Time: <b>{centum.time(recipe.time)}</b></h4>
                        <h4 className='pale'>Calories: <b>{recipe.calories}</b> (<b>{caloriesPercent}%</b>)</h4>
                    </div>

                    <h4 className='pale'>Source</h4>
                    <input value={link} onChange={e => setState({...state, link: e.target.value})} placeholder='URL of recipe' type='text' />

                    <h4 className='pale'>Rating: <b>{rating}%</b></h4>
                    <input value={rating} onChange={e => setState({...state, rating: parseInt(e.target.value)})} type='range' step={1} />

                    <button onClick={onUpdateInfo} className='light-btn'>Update</button>

                    {cooking === null ?
                            <>
                                <h1>New Cooking</h1>
                            
                                <textarea value={text} onChange={e => setState({...state, text: e.target.value})} placeholder='Describe it...' />
                                <ImageLoader setImage={setImage} />

                                <button onClick={() => onManageCooking('create')}>Create</button>

                                <DataPagination initialItems={recipe.cookings} setItems={setCookings} label='List of Cookings:' />
                                <div className='items half'>
                                    {cookings.map(el => 
                                        <div onClick={() => setCooking(el)} className='item panel'>
                                            {centum.shorter(el.text)}
                                            <h5 className='pale'>{el.dateUp}</h5>
                                        </div>    
                                    )}
                                </div>
                            </>
                        :
                            <>
                                <CloseIt onClick={() => setCooking(null)} />

                                {cooking.image !== '' && <ImageLook src={cooking.image} className='photo_item' alt='cooking photo' />}

                                <h2>Text: {cooking.text}</h2>

                                <div className='items small'>
                                    <h4 className='pale'>Author: {cooking.name}</h4>
                                    <h4 className='pale'><b>{cooking.likes}</b> likes</h4>
                                </div>

                                {context.username === cooking.name ?
                                        <button onClick={() => onManageCooking('delete')}>Delete</button>
                                    :
                                        <button onClick={() => onManageCooking('like')}>Like</button>
                                }
                            </>
                    }

                    {step === null ?
                            <>
                                <DataPagination initialItems={recipe.steps} setItems={setSteps} label='Steps of preparing:' />
                                <div className='items half'>
                                    {steps.map(el => 
                                        <div onClick={() => setStep(el)} className='item card'>
                                            {centum.shorter(el.content)}
                                        </div>    
                                    )}
                                </div>
                            </>
                        :
                            <>
                                <CloseIt onClick={() => setStep(null)} />

                                <textarea value={content} onChange={e => setState({...state, content: e.target.value})} placeholder='Content...' />
                                <h4 className='pale'>Duration: <b>{step.duration}</b> min.</h4>

                                <button onClick={onUpdateStep} className='light-btn'>Update</button>
                            </>
                    }

                    <h2>Health of Recipe's Ingredient</h2>

                    <div className='items half'>
                        {recipe.ingredients.map(el => 
                            <div onClick={() => setState({...state, ingredient: el})} className='item card'>
                                {centum.shorter(el)}
                            </div>    
                        )}
                    </div>

                    <h4 className='pale'>Type</h4>
                    <div className='items small'>
                        {HEALTH_TYPES.map(el => <div onClick={() => setState({...state, category: el})} className={el === category ? 'item label active' : 'item label'}>{el}</div>)}
                    </div> 
                            
                    <h4 className='pale'>Part: <b>{percent}%</b></h4>
                    <input value={percent} onChange={e => setState({...state, percent: parseInt(e.target.value)})} type='range' step={1} />

                    <button onClick={onMakeHealth}>Publish</button>

                    <DataPagination initialItems={recipe.healthes} setItems={setHealthes} label='Health of Recipe:' />
                    <div className='items half'>
                        {healthes.map(el => 
                            <div className='item panel'>
                                {centum.shorter(el.ingredient)}
                                <div className='items small'>
                                    <h5 className='pale'>{el.category}</h5>
                                    <h5 className='pale'><b>{el.percent}</b>%</h5>
                                </div>
                            </div>    
                        )}
                    </div>
                </>
            }

            {recipe === null && <Loading />}
        </>
    )
}

export default Recipes