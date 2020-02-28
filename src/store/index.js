// const { default: store } = process.env.NODE_ENV === 'production' ? require('./storeProd') : require('./storeDev')

// Exporting the store, then use it anywhere like store.getState() or store.dispatch()
// module.exports = store()

import { createStore, applyMiddleware } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import thunk from 'redux-thunk'
import rootReducer from '../reducers/index'

export default createStore(rootReducer, composeWithDevTools({})(applyMiddleware(thunk)))
