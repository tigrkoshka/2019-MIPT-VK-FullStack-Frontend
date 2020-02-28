import React from 'react'
import { MemoryRouter } from 'react-router-dom'
import Header from '../components/Header'
import burger from '../images/burger.png'
import toChats from '../images/back.png'

export default {
  title: 'Header',
  component: Header,
}

export const HeaderChats = () => (
  <MemoryRouter>
    <Header
      leftImg={burger}
      leftLink="/UserProfile/1"
      rightImg=""
      rightText="Exit"
      name="Hummingbird"
      onRightClick={(event) => {
        event.preventDefault()
        window.location.hash = '#/'
      }}
    />
  </MemoryRouter>
)

HeaderChats.story = {
  name: 'Header with both left and right buttons',
}

export const HeaderChatProfile = () => (
  <MemoryRouter>
    <Header
      leftImg={toChats}
      leftLink="/ChatList/1"
      rightImg=""
      rightText=""
      name="Create a chat"
      onRightClick={() => {}}
    />
  </MemoryRouter>
)

HeaderChatProfile.story = {
  name: 'Header with a go-back button',
}
