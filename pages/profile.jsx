import { useRef, useContext, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import axios from "axios";

import { AuthContext } from "../stores/authContext";
import { UserLoggedContext } from "../stores/userLoggedContext";

import styles from "../styles/pages/login.module.css";

import MainSuperiorBar from "../components/elements/MainSuperiorBar";
import { updateUserByUser } from "../services/users.service";

const Profile = () => {
  const email = useRef(null);
  const password = useRef(null);
  const name = useRef(null);
  const lastname = useRef(null);
  const router = useRouter();

  const { login, authState, loggoutAuth } = useContext(AuthContext);
  const { userLogged, userState, userLoggout } = useContext(UserLoggedContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const changes = {
        email: email.current.value,
        password: password.current.value,
        lastname: lastname.current.value,
        name: name.current.value,
      };

      const { data } = await updateUserByUser(
        userState.id,
        changes,
        authState.acces_token
      );

      userLogged({
        email: data.email,
        name: data.name,
        lastname: data.lastname,
      });

      email.current.value = data.email;
      lastname.current.value = data.lastname;
      name.current.value = data.name;
      password.current.value = "";

      alert("Datos actualizados");
    } catch (error) {
      const { response } = error;

      if (response.status === 401) {
        loggoutAuth();
        userLoggout();
        router.push("/login");
      }

      alert("Ha ocurrido un error");
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      
      if (!authState?.role) {
        router.push("/login");
      }
    }, 600);

    return () => {
      clearTimeout(timeout);
    };
  }, [authState]);

  return (
    <>
      <header className="header_main">
        <MainSuperiorBar />
      </header>
      <main className={styles.main_container}>
        <div className="container_width">
          <form onSubmit={handleSubmit}>
            <div className={styles.form_groups}>
              <label htmlFor="email">Email: </label>
              <input
                type="text"
                id="email"
                defaultValue={userState.email ? userState.email : ""}
                autoComplete="off"
                ref={email}
              />
            </div>

            <div className={styles.form_groups}>
              <label htmlFor="name">Nombre: </label>
              <input
                type="text"
                id="name"
                autoComplete="off"
                defaultValue={userState.name ? userState.name : ""}
                ref={name}
              />
            </div>

            <div className={styles.form_groups}>
              <label htmlFor="lastname">Apellido: </label>
              <input
                type="text"
                id="lastname"
                autoComplete="off"
                defaultValue={userState.lastname ? userState.lastname : ""}
                ref={lastname}
              />
            </div>

            <div className={styles.form_groups}>
              <label htmlFor="password">
                Nueva Contraseña <small>(Opcional)</small>:{" "}
              </label>
              <input type="password" id="password" ref={password} />
            </div>

            <div>
              <input
                type="submit"
                className={`${styles.login_button} mb-3 main_button`}
                value="Actualizar"
              />
            </div>
            <button
              type="button"
              onClick={() => router.back()}
              className="main_button btn-secondary mb-3"
            >
              Volver
            </button>
          </form>
        </div>
      </main>
    </>
  );
};

export default Profile;
