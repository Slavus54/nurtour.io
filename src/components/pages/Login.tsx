import {useState, useContext} from 'react'
import {useMutation} from '@apollo/client'
import {Context} from '../../context/WebProvider'
import {loginM} from '../../graphql/profile/ProfileQueries'

const Login = () => {
    const {change_context} = useContext(Context)
    const [state, setState] = useState({
        security_code: ''
    })

    const {security_code} = state   

    const [login] = useMutation(loginM, {
        optimisticResponse: true,
        onCompleted(data) {
            console.log(data.login)
            change_context('update', data.login, 3)
        }
    })

    const onLogin = () => {
        login({
            variables: {
                security_code
            }
        })
    }

    return (
        <div className='main'>
            <h1>Enter to Account</h1>
            <input value={security_code} onChange={e => setState({...state, security_code: e.target.value})} placeholder='Security code' type='text' />           

            <button onClick={onLogin}>LogIn</button>
        </div>
    )
}

export default Login