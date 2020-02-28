import React from 'react'
import { MemoryRouter } from 'react-router-dom'
import CreateChat from '../components/CreateChat'

export default {
  title: 'CreateChat',
  component: CreateChat,
}

const props = {
  match: {
    params: {
      userId: '1',
    },
  },
}

export const HeaderChats = () => (
  <MemoryRouter>
    {/* eslint-disable-next-line react/jsx-props-no-spreading */}
    <CreateChat {...props} />
  </MemoryRouter>
)

HeaderChats.story = {
  name: 'Log in page of the app',
}
