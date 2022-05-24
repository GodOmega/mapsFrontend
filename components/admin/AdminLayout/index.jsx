import { useState } from "react";
import Link from 'next/link'

import styles from "./styles.module.css";

import MenuIcon from '../../ui/icons/MenuIcon'

const AdminLayout = ({ children }) => {
 const [openNav, setOpenNav] = useState(false)

  return (
    <>
      <div className="row">
      <div className={`col-6 col-md-4 ${styles.admin__nav} ${openNav ? styles.admin__nav_open : ''}`}>
        <div>
            <div onClick={() => setOpenNav(false)} className={styles.admin__nav_close}>
                X
            </div>
            <h3>Administración</h3>
            <nav>
              <ul>
                  <li>
                    <Link href="/admin/users">
                      Usuarios
                    </Link>
                  </li>
                  <li>Empresas</li>
              </ul>
            </nav>
        </div>
      </div>
      <main className={`col-12 col-md-8 ${styles.main__content}`}>{children}</main>
      </div>
      <div onClick={() => setOpenNav(true)} className={styles.navbar__open_icon}>
      <MenuIcon fill="#333" />
      </div>
    </>
  );
};

export default AdminLayout;
