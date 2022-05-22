import React from 'react'

import styles from './style.module.css'

import LogoIcon from '../../ui/icons/LogoIcon'

const MainSuperiorBar = () => {
  return (
    <div className={styles.container}>
        <div className={styles.image}>
          <LogoIcon />
        </div>
    </div>
  )
}

export default MainSuperiorBar