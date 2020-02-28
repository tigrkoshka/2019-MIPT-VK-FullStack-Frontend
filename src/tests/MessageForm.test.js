/* eslint-disable react/jsx-props-no-spreading */
import React from 'react'
import { MemoryRouter } from 'react-router-dom'
import renderer from 'react-test-renderer'
import MessageForm from '../components/MessageForm'

describe('Chat page renders and acts correctly', () => {
  let props
  let component

  beforeEach(() => {
    props = {
      match: {
        params: {
          name: 'maslo',
          tag: '@maslo',
          userId: '1',
        },
      },
    }

    component = renderer
      .create(
        <MemoryRouter>
          <MessageForm {...props} />
        </MemoryRouter>,
      )
      .toJSON()
  })

  it('Should render normally', () => {
    expect(component).toMatchSnapshot()
  })
})
