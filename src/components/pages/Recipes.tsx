import React, {useState, useMemo, useEffect, useContext} from 'react'
import {useQuery} from '@apollo/client'
import {RECIPE_TYPES, CUISINES, LEVELS, SEARCH_PERCENT} from '../../env/env'
//@ts-ignore
import Centum from 'centum.js'
import {Context} from '../../context/WebProvider'
import NavigatorWrapper from '../router/NavigatorWrapper'
import Loading from '../UI/Loading'
import DataPagination from '../UI/DataPagination'
import {getRecipesQ} from '../../graphql/pages/RecipePageQueries'

const Recipes: React.FC = () => {
    const {context} = useContext<any>(Context)
    const [recipes, setRecipes] = useState(null)
    const [filtered, setFiltered] = useState<any[]>([])
    const [title, setTitle] = useState<string>('')
    const [category, setCategory] = useState<string>(RECIPE_TYPES[0])
    const [cuisine, setCuisine] = useState<string>(CUISINES[0])
    const [level, setLevel] = useState<string>(LEVELS[0])

    const centum = new Centum()

    const {data, loading} = useQuery(getRecipesQ)

    useEffect(() => {
        if (data && context.account_id !== '') {
            setRecipes(data.getRecipes)
        }
    }, [data])

    useMemo(() => {
        if (recipes !== null) {
            let result = recipes.filter(el => el.cuisine === cuisine && el.level === level)

            if (title !== '') {
                result = result.filter(el => centum.search(el.title, title, SEARCH_PERCENT))
            }
        
            result = result.filter(el => el.category === category)
      
            setFiltered(result)
        }
    }, [recipes, title, category, cuisine, level])
    
    return (
        <>          
            <h1>Best recipe for children</h1>

            <h4 className='pale'>Title</h4>
            <textarea value={title} onChange={e => setTitle(e.target.value)} placeholder='Title of recipe' />

            <div className='items small'>
                <select value={cuisine} onChange={e => setCuisine(e.target.value)}>
                    {CUISINES.map(el => <option value={el}>{el}</option>)}
                </select>
                <select value={level} onChange={e => setLevel(e.target.value)}>
                    {LEVELS.map(el => <option value={el}>{el}</option>)}
                </select>
            </div>

            <h4 className='pale'>Type</h4>
            <div className='items small'>
                {RECIPE_TYPES.map(el => <div onClick={() => setCategory(el)} className={el === category ? 'item label active' : 'item label'}>{el}</div>)}
            </div> 

            <DataPagination initialItems={filtered} setItems={setFiltered} label='List of recipes:' />

            {data !== null &&
                <div className='items half'>
                    {filtered.map(el => 
                        <div className='item panel'>
                            <NavigatorWrapper url={`/recipe/${el.shortid}`} isRedirect={false}>
                                {centum.shorter(el.title)}
                            </NavigatorWrapper>
                        </div>
                    )}
                </div>
            }

            {loading && <Loading />}
        </>
    )
}

export default Recipes