import React from 'react'

import MenuSuperiorBar from '../../elements/MenuSuperiorBar'
import Navbar from '../../elements/Navbar'
import styles from './style.module.css'

const MainHeader = () => {
  return (
    <header className={` ${styles.header_container} header_main`}>
        <MenuSuperiorBar/>
        <Navbar />
    </header>
  )
}

export default MainHeader