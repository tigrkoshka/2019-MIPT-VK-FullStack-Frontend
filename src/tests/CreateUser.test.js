/* eslint-disable react/jsx-props-no-spreading */
import React from 'react'
import { MemoryRouter } from 'react-router-dom'
import renderer from 'react-test-renderer'
import CreateUser from '../components/CreateUser'

describe('Registration page renders and acts correctly', () => {
  let component

  beforeEach(() => {
    component = renderer
      .create(
        <MemoryRouter>
          <CreateUser />
        </MemoryRouter>,
      )
      .toJSON()
  })

  it('Should render normally', () => {
    expect(component).toMatchSnapshot()
  })
})
