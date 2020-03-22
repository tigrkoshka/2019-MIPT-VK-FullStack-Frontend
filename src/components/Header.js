import React from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import headerStyles from '../styles/headerStyles.module.scss'
import imagesStyles from '../styles/imagesStyles.module.scss'

function Header({ leftLink, leftImg, rightText, rightImg, name, onRightClick }) {
  let backName
  let rightButton
  if (leftLink.substring(0, 9) === '/ChatList') {
    backName = (
      <div className={headerStyles.vertical}>
        <div className={headerStyles.text}>Chats</div>
      </div>
    )
  } else if (leftLink === '/') {
    backName = (
      <div className={headerStyles.vertical}>
        <div className={headerStyles.text}>Home</div>
      </div>
    )
  }
  if (rightImg !== '') {
    rightButton = (
      <div className={headerStyles.rightButton} onClick={onRightClick}>
        <div className={headerStyles.vertical}>
          <div
            className={`${imagesStyles[rightImg]}`}
            style={{
              height: '35px',
              width: '35px',
            }}
          />
        </div>
      </div>
    )
  } else if (rightText !== '') {
    rightButton = (
      <div className={headerStyles.rightButton} onClick={onRightClick}>
        <div className={headerStyles.vertical}>
          <div className={headerStyles.text}>{rightText}</div>
        </div>
      </div>
    )
  }
  return (
    <div className={headerStyles.rectangle}>
      <div className={headerStyles.leftHorizontal}>
        <Link to={leftLink} className={headerStyles.leftButton}>
          <div className={headerStyles.vertical}>
            <div
              className={`${imagesStyles[leftImg]}`}
              style={{
                height: '25px',
                width: '25px',
              }}
            />
          </div>
          {backName}
        </Link>
      </div>
      <div className={headerStyles.horizontal}>
        <div className={headerStyles.vertical}>
          <div className={headerStyles.name}>{name}</div>
        </div>
      </div>
      <div className={headerStyles.rightHorizontal}>{rightButton}</div>
    </div>
  )
}

Header.propTypes = {
  leftLink: PropTypes.string.isRequired,
  leftImg: PropTypes.string.isRequired,
  rightText: PropTypes.string.isRequired,
  rightImg: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  onRightClick: PropTypes.func.isRequired,
}

export default Header
