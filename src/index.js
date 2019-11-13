import React from 'react'
import { Route, HashRouter as Router, Switch } from 'react-router-dom'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import store from './store'
import './styles/globalStyles.css'
import * as serviceWorker from './utils/serviceWorker'
import ChatList from './components/ChatList'
import MessageForm from './components/MessageForm'

render(
  <Provider store={store}>
    <Router basename="/">
      <Switch>
        <Route exact path="/" component={ChatList} />
        <Route path="/MessageForm/:name" component={MessageForm} />
      </Switch>
    </Router>
  </Provider>,
  document.getElementById('root'),
)
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister()
