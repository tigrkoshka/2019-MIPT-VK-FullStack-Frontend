import React from 'react'
import { MemoryRouter } from 'react-router-dom'
import CreateUser from '../components/CreateUser'

export default {
  title: 'CreateUser',
  component: CreateUser,
}

export const HeaderChats = () => (
  <MemoryRouter>
    <CreateUser />
  </MemoryRouter>
)

HeaderChats.story = {
  name: 'Sign up page',
}
