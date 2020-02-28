/* eslint-disable react/jsx-props-no-spreading */
import React from 'react'
import { MemoryRouter } from 'react-router-dom'
import renderer from 'react-test-renderer'
import UserProfile from '../components/UserProfile'

describe('User profile page renders and acts correctly', () => {
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
          <UserProfile {...props} />
        </MemoryRouter>,
      )
      .toJSON()
  })

  it('Should render normally', () => {
    expect(component).toMatchSnapshot()
  })
})
