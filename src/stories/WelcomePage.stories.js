import React from 'react'
import { MemoryRouter } from 'react-router-dom'
import WelcomePage from '../components/WelcomePage'

export default {
  title: 'WelcomePage',
  component: WelcomePage,
}

export const HeaderChats = () => (
  <MemoryRouter>
    <WelcomePage />
  </MemoryRouter>
)

HeaderChats.story = {
  name: 'Sign in page',
}
