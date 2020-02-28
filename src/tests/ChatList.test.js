/* eslint-disable react/jsx-props-no-spreading */
import React from 'react'
import { MemoryRouter } from 'react-router-dom'
import renderer from 'react-test-renderer'
import ChatList from '../components/ChatList'

describe('Chat list renders and acts correctly', () => {
  let props
  let component

  beforeEach(() => {
    props = {
      match: {
        params: {
          userId: '1',
        },
      },
    }

    component = renderer
      .create(
        <MemoryRouter>
          <ChatList {...props} />
        </MemoryRouter>,
      )
      .toJSON()
  })

  it('Should render normally', () => {
    expect(component).toMatchSnapshot()
  })
})
