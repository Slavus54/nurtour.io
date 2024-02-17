import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals'
import {ApolloClient, ApolloProvider, InMemoryCache} from '@apollo/client'
import {createHttpLink} from 'apollo-link-http'
<<<<<<< HEAD
import {WebProvider} from './context/WebProvider'
import {WEBSERVER_URL} from './env/env'


=======
import {Provider} from 'react-redux'
import {WebProvider} from './context/WebProvider'
import {store} from './store/store'
import {WEBSERVER_URL} from './env/env'

>>>>>>> a71f9be (Added masterpiece component, own route of tour's locations with redux on map, small UI changes)
//@ts-ignore
const httpLink = new createHttpLink({
  uri: WEBSERVER_URL + '/graphql'
})

const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache()
})

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
)

root.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
<<<<<<< HEAD
      <WebProvider>
        <App />
      </WebProvider>
=======
      <Provider store={store}>
        <WebProvider>
          <App />
        </WebProvider>
      </Provider>
>>>>>>> a71f9be (Added masterpiece component, own route of tour's locations with redux on map, small UI changes)
    </ApolloProvider>
  </React.StrictMode>
)

reportWebVitals()
