import React from 'react'
import headerStyles from '../styles/headerStyles.module.scss'
import appStyles from '../styles/app.module.scss'

function Header(name: string) {
  return (
    <div className={headerStyles.rectangle}>
      <div className={headerStyles.horizontal}>
        <div className={headerStyles.vertical}>
          <div className={headerStyles.name}>{name}</div>
        </div>
      </div>
    </div>
  )
}

function App() {
  return <div className={appStyles.container}>{Header('TechnoTrack Translator')}</div>
}

export default App
