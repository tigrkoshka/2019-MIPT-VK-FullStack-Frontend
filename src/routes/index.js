import React from 'react'
import { Router, Route, Switch } from 'react-router-dom'
import { createBrowserHistory } from 'history'
import styled from '@emotion/styled'
import ChatList from '../components/ChatList'
import MessageForm from '../components/MessageForm'

const Container = styled.div`
  text-align: center;
`
export const history = createBrowserHistory()

function Routes() {
  return (
    <Router history={history}>
      <Container>
        <Switch>
          <Route path="/">
            {' '}
            <ChatList />
          </Route>
          <Route path="/MessageForm">
            <MessageForm name="Эшли" />{' '}
          </Route>
        </Switch>
      </Container>
    </Router>
  )
}

export default Routes
