import React, {useState, useContext} from 'react'
import {useMutation} from '@apollo/client'
import {MASTERPIECE_TYPES, EPOCHES, COUNTRIES, COLLECTION_LIMIT} from '../../env/env'
import {Context} from '../../context/WebProvider'
import FormPagination from '../UI/FormPagination'
import ImageLoader from '../UI/ImageLoader'
import {ModernAlert} from '../UI/ModernAlert'
import {createMasterpieceM} from '../../graphql/pages/MasterpiecePageQueries'
import {CollectionPropsType} from '../../types/types'

const CreateMasterpiece: React.FC<CollectionPropsType> = ({params}) => {
    const {context} = useContext<any>(Context)
    const [idx, setIdx] = useState<number>(0)
    const [image, setImage] = useState<string>('')
    const [state, setState] = useState({
        title: '', 
        category: MASTERPIECE_TYPES[0], 
        country: COUNTRIES[0], 
        epoch: EPOCHES[0]
    })

    const {title, category, country, epoch} = state

    const [createMasterpiece] = useMutation(createMasterpieceM, {
        optimisticResponse: true,
        onCompleted(data) {
            console.log(data.createMasterpiece)
            ModernAlert(data.createMasterpiece)
        }
    })

    const onCreate = () => {
        createMasterpiece({
            variables: {
                username: context.username, id: params.id, title, category, country, epoch, main_photo: image
            }
        })
    }

    return (
        <div className='main'>          
            <FormPagination num={idx} setNum={setIdx} items={[
                    <>
                        <h4 className='pale'>Title</h4>
                        <textarea value={title} onChange={e => setState({...state, title: e.target.value})} placeholder='Title of masterpice' />
                
                        <select value={epoch} onChange={e => setState({...state, epoch: e.target.value})}>
                            {EPOCHES.map(el => <option value={el}>{el}</option>)}
                        </select> 

                        <h4 className='pale'>Type</h4>
                        <div className='items small'>
                            {MASTERPIECE_TYPES.map(el => <div onClick={() => setState({...state, category: el})} className={el === category ? 'item label active' : 'item label'}>{el}</div>)}
                        </div> 
                    </>,
                    <> 
                        <h4 className='pale'>Country</h4>
                        <div className='items small'>
                            {COUNTRIES.map(el => <div onClick={() => setState({...state, country: el})} className={el === country ? 'item label active' : 'item label'}>{el}</div>)}
                        </div> 

                        <ImageLoader setImage={setImage} />
                    </>
                ]} 
            >
                <h1>New Masterpiece</h1>
            </FormPagination>

            <button onClick={onCreate}>Create</button>
        </div>
    )
}

export default CreateMasterpiece