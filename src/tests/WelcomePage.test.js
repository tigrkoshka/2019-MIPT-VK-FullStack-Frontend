/* eslint-disable react/jsx-props-no-spreading */
import React from 'react'
import { MemoryRouter } from 'react-router-dom'
import renderer from 'react-test-renderer'
import WelcomePage from '../components/WelcomePage'

describe('Welcome page renders and acts correctly', () => {
  let component

  beforeEach(() => {
    component = renderer
      .create(
        <MemoryRouter>
          <WelcomePage />
        </MemoryRouter>,
      )
      .toJSON()
  })

  it('Should render normally', () => {
    expect(component).toMatchSnapshot()
  })
})
