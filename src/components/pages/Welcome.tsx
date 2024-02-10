import React from 'react'
import NavigatorWrapper from '../router/NavigatorWrapper'

const Welcome: React.FC = () => {
    
    return (
        <>          
            <h1>Nurtour.IO</h1>
            <h3 className='pale text'>App for parents to nurture children</h3>
            
            <NavigatorWrapper isRedirect={false} url='/register'>
                <button className='light-btn'>Start</button>
            </NavigatorWrapper>
        </>
    )
}

export default Welcome