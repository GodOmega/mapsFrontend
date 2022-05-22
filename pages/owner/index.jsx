import { useContext } from "react";
import Link from "next/link";
import MainHeader from "../../components/ui/MainHeader";
import { UserLoggedContext } from "../../stores/userLoggedContext";

import styles from "../../styles/pages/onwer/home.module.css";
import fullNameFirstLetter from "../../utils/fullNameFirstLetter";

const index = () => {
  const { userState } = useContext(UserLoggedContext);

  return (
    <>
      <MainHeader />
      <main className={styles.container}>
        {/* User information section */}

        <section className={`${styles.user_info__section} ${styles.sections}`}>
          <div className={`${styles.user__info_container} container_width`}>
            <div className={styles.user__info_image}>
              <div>
                {fullNameFirstLetter(userState.name, userState.lastname)}
              </div>
            </div>

            <div>
              <h3>
                {userState.name} {userState.lastname}
              </h3>
            </div>
          </div>
        </section>

        {/* enterprises section */}
        <section className={`${styles.enterprise__section} ${styles.sections}`}>
          <div className="container_width">
            <h2>Tus empresas:</h2>
            <div className={styles.enterprises__container}>
              {userState.enterprises &&
                userState.enterprises.map(({ id, name }) => (
                  <div key={id} className={styles.enterprise__item}>
                    <h3>{name}</h3>
                    <Link href={`owner/enterprise/${id}`}>
                      <a>ver detalles</a>
                    </Link>
                  </div>
                ))}
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default index;
