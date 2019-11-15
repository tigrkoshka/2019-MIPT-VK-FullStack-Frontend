import React from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import headerStyles from '../styles/headerStyles.module.scss'

function Header({ leftLink, leftImg, rightImg, name, onRightClick }) {
  let toChats = null
  let rightButton = null
  if (leftLink === '/ChatList') {
    toChats = (
      <div className={headerStyles.vertical}>
        <div className={headerStyles.text}>Chats</div>
      </div>
    )
  }
  if (rightImg !== '') {
    rightButton = (
      // eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions
      <div className={headerStyles.rightButton} onClick={onRightClick}>
        <div className={headerStyles.vertical}>
          <img src={rightImg} height="35px" width="height" alt="" />
        </div>
      </div>
    )
  }
  return (
    <div className={headerStyles.rectangle}>
      <div className={headerStyles.leftHorizontal}>
        <Link to={leftLink} className={headerStyles.leftButton}>
          <div className={headerStyles.vertical}>
            <img src={leftImg} height="25px" width="height" alt="" />
          </div>
          {toChats}
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
  rightImg: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  onRightClick: PropTypes.func.isRequired,
}

export default Header
