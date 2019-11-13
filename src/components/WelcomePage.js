import React from 'react'
import { Link } from 'react-router-dom'
import welcomePageStyles from '../styles/welcomePageStyles.module.scss'

function WelcomePage() {
  return (
    <Link to="/ChatList" className={welcomePageStyles.vert}>
      <div className={welcomePageStyles.horiz}>
        <div className={welcomePageStyles.curr_message}>
          <div className={welcomePageStyles.content}>
            Thank you for choosing Hummingbird!
            <br />
            Tap anywhere to continue.
          </div>
          <div className={welcomePageStyles.time}>2:39</div>
        </div>
      </div>
    </Link>
  )
}

export default WelcomePage
