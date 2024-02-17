import React, {useState, useMemo, useEffect, useContext} from 'react'
import {useQuery} from '@apollo/client'
import {MASTERPIECE_TYPES, EPOCHES, SEARCH_PERCENT} from '../../env/env'
//@ts-ignore
import Centum from 'centum.js'
import {Context} from '../../context/WebProvider'
import NavigatorWrapper from '../router/NavigatorWrapper'
import Loading from '../UI/Loading'
import DataPagination from '../UI/DataPagination'
import {getMasterpiecesQ} from '../../graphql/pages/MasterpiecePageQueries'

const Masterpieces: React.FC = () => {
    const {context} = useContext<any>(Context)
    const [masterpieces, setMasterpieces] = useState(null)
    const [filtered, setFiltered] = useState<any[]>([])
    const [title, setTitle] = useState<string>('')
    const [category, setCategory] = useState<string>(MASTERPIECE_TYPES[0])
    const [epoch, setEpoch] = useState<string>(EPOCHES[0])

    const centum = new Centum()

    const {data, loading} = useQuery(getMasterpiecesQ)

    useEffect(() => {
        if (data && context.account_id !== '') {
            setMasterpieces(data.getMasterpieces)
        }
    }, [data])

    useMemo(() => {
        if (masterpieces !== null) {
            let result = masterpieces.filter(el => el.category === category)

            if (title !== '') {
                result = result.filter(el => centum.search(el.title, title, SEARCH_PERCENT))
            }
        
            result = result.filter(el => el.epoch === epoch)
      
            setFiltered(result)
        }
    }, [masterpieces, title, category, epoch])
    
    return (
        <>          
            <h1>Masterpieces</h1>

            <textarea value={title} onChange={e => setTitle(e.target.value)} placeholder='Title of masterpiece' />
            
            <select value={epoch} onChange={e => setEpoch(e.target.value)}>
                {EPOCHES.map(el => <option value={el}>{el}</option>)}
            </select> 

            <h4 className='pale'>Type</h4>
            <div className='items small'>
                {MASTERPIECE_TYPES.map(el => <div onClick={() => setCategory(el)} className={el === category ? 'item label active' : 'item label'}>{el}</div>)}
            </div> 

            <DataPagination initialItems={filtered} setItems={setFiltered} label='List of masterpieces:' />

            {data !== null &&
                <div className='items half'>
                    {filtered.map(el => 
                        <div className='item panel'>
                            <NavigatorWrapper url={`/masterpiece/${el.shortid}`} isRedirect={false}>
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

export default Masterpieces