import React, {useState} from 'react'
import NavigatorWrapper from '../router/NavigatorWrapper'
import features from '../../env/features.json'
import CloseIt from '../UI/CloseIt'
import {FeatureItem} from '../../types/types'

const Welcome: React.FC = () => {
    const [feature, setFeature] = useState<FeatureItem | null>(null)

    return (
        <>          
            <h1>Nurtour.IO</h1>
            <h3 className='pale'>App for european parents to nurture their children</h3>
            
            <NavigatorWrapper isRedirect={false} url='/register'>
                <button className='light-btn'>Start</button>
            </NavigatorWrapper>

            {feature === null ? 
                    <>
                        <h2>Features</h2>
                        <div className='items half'>
                            {features.map(el => 
                                <div onClick={() => setFeature(el)} className='text-card text'>
                                    {el.title}
                                </div>
                            )}
                        </div>
                    </>
                :
                    <>
                        <CloseIt onClick={() => setFeature(null)} />

                        <h2>{feature.title}</h2>
                        <h4 className='pale'>Type: <b>{feature.category}</b></h4>

                        <p>{feature.text}</p>
                    </>
            }
        </>
    )
}

export default Welcome