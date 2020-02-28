/* eslint-disable react/jsx-props-no-spreading */
import React from 'react'
import { MemoryRouter } from 'react-router-dom'
import renderer from 'react-test-renderer'
import Header from '../components/Header'
import toChats from '../images/back.png'

describe('Header renders and acts correctly', () => {
  let component

  beforeEach(() => {
    component = renderer
      .create(
        <MemoryRouter>
          <Header
            leftImg={toChats}
            rightImg=""
            rightText=""
            leftLink="/ChatList/1"
            name="Test header"
            onRightClick={() => {}}
          />
        </MemoryRouter>,
      )
      .toJSON()
  })

  it('Should render normally', () => {
    expect(component).toMatchSnapshot()
  })
})
