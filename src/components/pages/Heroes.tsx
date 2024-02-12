import React, {useState, useMemo, useEffect, useContext} from 'react'
import {useQuery} from '@apollo/client'
import {CENTURES, COUNTRIES, SEARCH_PERCENT} from '../../env/env'
//@ts-ignore
import Centum from 'centum.js'
import {Context} from '../../context/WebProvider'
import NavigatorWrapper from '../router/NavigatorWrapper'
import Loading from '../UI/Loading'
import DataPagination from '../UI/DataPagination'
import {getHeroesQ} from '../../graphql/pages/HeroPageQueries'

const Heroes: React.FC = () => {
    const {context} = useContext<any>(Context)
    const [heroes, setHeroes] = useState(null)
    const [filtered, setFiltered] = useState<any[]>([])
    const [fullname, setFullname] = useState<string>('')
    const [century, setCentury] = useState<string>(CENTURES[0])
    const [country, setCountry] = useState<string>(COUNTRIES[0])

    const centum = new Centum()

    const {data, loading} = useQuery(getHeroesQ)

    useEffect(() => {
        if (data && context.account_id !== '') {
            setHeroes(data.getHeroes)
        }
    }, [data])

    useMemo(() => {
        if (heroes !== null) {
            let result = heroes.filter(el => el.century === century)

            if (fullname !== '') {
                result = result.filter(el => centum.search(el.fullname, fullname, SEARCH_PERCENT))
            }
        
            result = result.filter(el => el.country === country)
      
            setFiltered(result)
        }
    }, [heroes, fullname, century, country])
    
    return (
        <>          
            <h1>Images for children</h1>

            <h4 className='pale'>Fullname</h4>
            <textarea value={fullname} onChange={e => setFullname(e.target.value)} placeholder='Name of hero' />
            
            <select value={century} onChange={e => setCentury(e.target.value)}>
                {CENTURES.map(el => <option value={el}>{el}</option>)}
            </select> 

            <h4 className='pale'>Motherland</h4>
            <div className='items small'>
                {COUNTRIES.map(el => <div onClick={() => setCountry(el)} className={el === country ? 'item label active' : 'item label'}>{el}</div>)}
            </div> 

            <DataPagination initialItems={filtered} setItems={setFiltered} label='Heroes:' />

            {data !== null &&
                <div className='items half'>
                    {filtered.map(el => 
                        <div className='item panel'>
                            <NavigatorWrapper url={`/hero/${el.shortid}`} isRedirect={false}>
                                {centum.shorter(el.fullname)}
                            </NavigatorWrapper>
                        </div>
                    )}
                </div>
            }

            {loading && <Loading />}
        </>
    )
}

export default Heroes