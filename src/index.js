import React from 'react'
import { Route, HashRouter as Router, Switch } from 'react-router-dom'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import store from './store/index'
import './styles/globalStyles.css'
import * as serviceWorker from './utils/serviceWorker'
import ChatList from './components/ChatList'
import MessageForm from './components/MessageForm'
import UserProfile from './components/UserProfile'
import WelcomePage from './components/WelcomePage'
import CreateUser from './components/CreateUser'
import CreateChat from './components/CreateChat'

render(
  <Provider store={store}>
    <Router basename="/">
      <Switch>
        <Route exact path="/" component={WelcomePage} />
        <Route path="/CreateUser" component={CreateUser} />
        <Route path="/ChatList/:userId" component={ChatList} />
        <Route path="/MessageForm/:tag/:name/:userId" component={MessageForm} />
        <Route path="/UserProfile/:userId" component={UserProfile} />
        <Route path="/CreateChat/:userId" component={CreateChat} />
      </Switch>
    </Router>
  </Provider>,
  document.getElementById('root'),
)
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister()
