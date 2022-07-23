import {useState, useContext} from "react";
import { useRouter } from "next/router";


import LogoIcon from '../../ui/icons/LogoIcon'
import MenuIcon from '../../ui/icons/MenuIcon'
import CloseIcon from "../../ui/icons/CloseIcon";

import styles from './style.module.css'
import { AuthContext } from "../../../stores/authContext";
import { UserLoggedContext } from "../../../stores/userLoggedContext";
const MenuSuperiorBar = () => {
  const [isOpen, setIsOpen] = useState(false)

  const {loggoutAuth} = useContext(AuthContext)
  const {userLoggout} = useContext(UserLoggedContext)

  const router = useRouter()

  const handleShowMenu = () => setIsOpen(!isOpen)

  const handleLoggout = () => {
    userLoggout()
    loggoutAuth()
    router.push('/login')
  }

  return (
    <>
      <div className={styles.container}>
        <div className={styles.logo}>
          <img src="/images/logo.png" alt="Logo" />
        </div>
        <div className={styles.menu_icon}>
          <MenuIcon onClick={handleShowMenu} fill='#00000' />
        </div>
      </div>

      {isOpen && (
      <div className={styles.fixed_menu}>
        <div className={styles.fixed_menu__container}>
          <div className={styles.fixed_menu__button}>

            <button onClick={() => router.push('/profile')} className={`main_button mb-3`}>Perfil</button>
            <button onClick={handleLoggout} className={`main_button `}>cerrar sesión</button>
          </div>
          <div onClick={handleShowMenu} className={styles.fixed_menu__close_icon}>
            <CloseIcon fill="#ffff"/>
          </div>
        </div>
      </div>
      )}

    </>
  );
};

export default MenuSuperiorBar;
