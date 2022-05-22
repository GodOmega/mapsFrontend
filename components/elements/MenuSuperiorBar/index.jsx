import React from "react";


import LogoIcon from '../../ui/icons/LogoIcon'
import MenuIcon from '../../ui/icons/MenuIcon'

import styles from './style.module.css'
const MenuSuperiorBar = () => {
  return (
    <div className={styles.container}>
      <div className={styles.logo}>
        <LogoIcon />
      </div>
      <div className={styles.menu_icon}>
        <MenuIcon />
      </div>
    </div>
  );
};

export default MenuSuperiorBar;
