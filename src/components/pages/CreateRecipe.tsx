import React, {useState, useContext} from 'react'
import {useMutation} from '@apollo/client'
import {RECIPE_TYPES, CUISINES, LEVELS, CALORIES_DEFAULT_VALUE, DURATION_DEFAULT_VALUE, RATING_DEFAULT_VALUE, COLLECTION_LIMIT} from '../../env/env'
//@ts-ignore
import Centum from 'centum.js'
//@ts-ignore
import shortid from 'shortid'
import {Context} from '../../context/WebProvider'
import MapPicker from '../UI/MapPicker'
import FormPagination from '../UI/FormPagination'
import {ModernAlert} from '../UI/ModernAlert'
import {createRecipeM} from '../../graphql/pages/RecipePageQueries'
import {CollectionPropsType} from '../../types/types'

const CreateRecipe: React.FC<CollectionPropsType> = ({params}) => {
    const {context} = useContext<any>(Context)
    const [idx, setIdx] = useState<number>(0)
    const [ingredient, setIngredient] = useState<string>('')
    const [step, setStep] = useState({
        id: shortid.generate().toString(),
        content: '',
        duration: DURATION_DEFAULT_VALUE
    })
    const [state, setState] = useState({
        title: '', 
        category: RECIPE_TYPES[0], 
        cuisine: CUISINES[0], 
        level: LEVELS[0], 
        ingredients: [], 
        steps: [], 
        time: 0, 
        calories: CALORIES_DEFAULT_VALUE, 
        link: '', 
        rating: RATING_DEFAULT_VALUE
    })

    const centum = new Centum()

    const {title, category, cuisine, level, ingredients, steps, time, calories, link, rating} = state
    const {id, content, duration} = step

    const [createRecipe] = useMutation(createRecipeM, {
        optimisticResponse: true,
        onCompleted(data) {
            console.log(data.createRecipe)
            ModernAlert(data.createRecipe)
        }
    })

    const onIngredient = () => {
        setState({...state, ingredients: [...ingredients, ingredient]})

        setIngredient('')
    }

    const onStep = () => {
        if (steps.length < COLLECTION_LIMIT) {
            setState({...state, steps: [...steps, step], time: time + duration})
        }
        
        setStep({
            id: shortid.generate().toString(),
            content: '',
            duration: DURATION_DEFAULT_VALUE
        })
    }

    const onCreate = () => {
        createRecipe({
            variables: {
                username: context.username, id: params.id, title, category, cuisine, level, ingredients, steps, time, calories, link, rating 
            }
        })
    }

    return (
        <div className='main'>          
            <FormPagination num={idx} setNum={setIdx} items={[
                    <>
                        <h4 className='pale'>Title</h4>
                        <input value={title} onChange={e => setState({...state, title: e.target.value})} placeholder='Title of recipe' type='text' />
                
                        <div className='items small'>
                            <select value={cuisine} onChange={e => setState({...state, cuisine: e.target.value})}>
                                {CUISINES.map(el => <option value={el}>{el}</option>)}
                            </select>
                            <select value={level} onChange={e => setState({...state, level: e.target.value})}>
                                {LEVELS.map(el => <option value={el}>{el}</option>)}
                            </select>
                        </div>

                        <h4 className='pale'>Type</h4>
                        <div className='items small'>
                            {RECIPE_TYPES.map(el => <div onClick={() => setState({...state, category: el})} className={el === category ? 'item label active' : 'item label'}>{el}</div>)}
                        </div> 
                    </>,
                    <>
                        <h4 className='pale'>Ingredients</h4>

                        <textarea value={ingredient} onChange={e => setIngredient(e.target.value)} placeholder='Title and weight' />

                        <button onClick={onIngredient}>Add</button>

                        <h4 className='pale'>Calories per 100g</h4>
                        <input value={calories} onChange={e => setState({...state, calories: parseInt(e.target.value)})} placeholder='Calories of dish' type='text' />
                    </>,
                    <>
                        <h4 className='pale'>Steps ({steps.length}/{COLLECTION_LIMIT})</h4>
                        <textarea value={content} onChange={e => setStep({...step, content: e.target.value})} placeholder='Describe it...' />

                        <h4 className='pale'>Duration: <b>{duration}</b> min.</h4>
                        <input value={duration} onChange={e => setStep({...step, duration: parseInt(e.target.value)})} type='range' step={5} />

                        <button onClick={onStep}>+</button>

                        <h4 className='pale'>Total: {centum.time(time)}</h4>
                    </>,
                    <>
                        <h4 className='pale'>Source</h4>
                        <input value={link} onChange={e => setState({...state, link: e.target.value})} placeholder='URL of recipe' type='text' />

                        <h4 className='pale'>Rating: <b>{rating}%</b></h4>
                        <input value={rating} onChange={e => setState({...state, rating: parseInt(e.target.value)})} type='range' step={1} />
                    </>
                ]} 
            >
                <h1>New Recipe</h1>
            </FormPagination>

            {isNaN(calories) ? <button onClick={() => setState({...state, calories: CALORIES_DEFAULT_VALUE})}>Reset</button> : <button onClick={onCreate}>Create</button>}
        </div>
    )
}

export default CreateRecipe