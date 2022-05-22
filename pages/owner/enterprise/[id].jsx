import { useContext, useState, useEffect } from "react";
import Link from "next/link";

import { useRouter } from "next/router";

import { AuthContext } from "../../../stores/authContext";
import MainHeader from "../../../components/ui/MainHeader";

// Service
import getEnterpriseService from "../../../services/owner/getEnterprise.service";

import styles from "../../../styles/pages/onwer/enterprise.module.css";

const Enterprise = () => {
  const {
    authState: { acces_token },
  } = useContext(AuthContext);

  const [enterprise, setEnterprise] = useState(null);

  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    Promise.all([getEnterpriseService(acces_token, id)])
      .then(([enterprise]) => {
        setEnterprise(enterprise);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [id, acces_token]);

  return (
    <>
      <MainHeader />
      <main className={styles.container}>
        {/* User information section */}

        {enterprise && (
          <>
            <section
              className={`${styles.user_info__section} ${styles.sections}`}
            >
              <div className={`${styles.user__info_container} container_width`}>
                <div>
                  <h2>{enterprise.name}</h2>
                </div>
              </div>
            </section>

            <section className={`${styles.sections}`}>
              <div className={` container_width`}>
                <div className={styles.enterprise__actions}>
                  <button className={`main_button ${styles.button_primary}`}>
                    Ver empleados
                  </button>

                  <button className={`main_button ${styles.button_secondary}`}>
                    Editar empresa
                  </button>

                  <Link href="/owner/">
                    <button className={`main_button ${styles.button_back}`}>
                      Volver
                    </button>
                  </Link>
                </div>
              </div>
            </section>

            {/* ENTERPRISE GROUPS SECTION */}

            <section className={`${styles.sections} ${styles.groups__section}`}>
              <div className={` container_width`}>
                <h2>Grupos de la empresa: </h2>
                <div className={styles.groups__container}>
                  {enterprise &&
                    enterprise.groups.map((group) => (
                      <div key={group.id} className={styles.group__item}>
                        <h3>{group.name}</h3>
                        <Link href={`/owner/enterprise/${id}/group/${group.id}`}>
                          <a className={``}>Ver detalles</a>
                        </Link>
                      </div>
                    ))}
                </div>
              </div>
            </section>
          </>
        )}
      </main>
    </>
  );
};

export default Enterprise;
