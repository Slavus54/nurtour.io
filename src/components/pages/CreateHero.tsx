import React, {useState, useContext} from 'react'
import {useMutation} from '@apollo/client'
import {COUNTRIES, CENTURES, COLLECTION_LIMIT} from '../../env/env'
//@ts-ignore
import Centum from 'centum.js'
import {Context} from '../../context/WebProvider'
import FormPagination from '../UI/FormPagination'
import ImageLoader from '../UI/ImageLoader'
import {ModernAlert} from '../UI/ModernAlert'
import {createHeroM} from '../../graphql/pages/HeroPageQueries'
import {CollectionPropsType} from '../../types/types'

const CreateHero: React.FC<CollectionPropsType> = ({params}) => {
    const {context} = useContext<any>(Context)
    const [idx, setIdx] = useState<number>(0)
    const [position, setPosition] = useState<string>('')
    const [image, setImage] = useState<string>('')
    const [state, setState] = useState({
        fullname: '', 
        positions: [], 
        country: COUNTRIES[0], 
        century: CENTURES[0]
    })

    const centum = new Centum()

    const {fullname, positions, country, century} = state

    const [createHero] = useMutation(createHeroM, {
        optimisticResponse: true,
        onCompleted(data) {
            console.log(data.createHero)
            ModernAlert(data.createHero)
        }
    })

    const onPosition = () => {
        let flag: boolean = positions.length < COLLECTION_LIMIT
        let result: (string | undefined) = positions.find(el => centum.search(el, position, 100))
    
        flag = result === undefined

        if (flag) {
            setState({...state, positions: [...positions, position]})
        }

        setPosition('')
    }

    const onCreate = () => {
        createHero({
            variables: {
                username: context.username, id: params.id, fullname, positions, country, century, image 
            }
        })
    }

    return (
        <div className='main'>          
            <FormPagination num={idx} setNum={setIdx} items={[
                    <>
                        <h4 className='pale'>Fullname</h4>
                        <input value={fullname} onChange={e => setState({...state, fullname: e.target.value})} placeholder='Name of person' type='text' />
                
                        <select value={century} onChange={e => setState({...state, century: e.target.value})}>
                            {CENTURES.map(el => <option value={el}>{el}</option>)}
                        </select> 

                        <h4 className='pale'>Motherland</h4>
                        <div className='items small'>
                            {COUNTRIES.map(el => <div onClick={() => setState({...state, country: el})} className={el === country ? 'item label active' : 'item label'}>{el}</div>)}
                        </div> 
                    </>,
                    <>  
                        <h4 className='pale'>Positions ({positions.length}/{COLLECTION_LIMIT})</h4>
                        <input value={position} onChange={e => setPosition(e.target.value)} placeholder='Title of position' type='text' />
                        <button onClick={onPosition}>Add</button>

                        <ImageLoader setImage={setImage} />
                    </>
                ]} 
            >
                <h1>New Hero</h1>
            </FormPagination>

            <button onClick={onCreate}>Create</button>
        </div>
    )
}

export default CreateHero