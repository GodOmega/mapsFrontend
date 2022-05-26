import { useRef, useContext, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";

import { AuthContext } from "../stores/authContext";

import styles from "../styles/pages/register.module.css";

import MainSuperiorBar from "../components/elements/MainSuperiorBar";

const Register = () => {
  const email = useRef(null);
  const name = useRef(null);
  const lastname = useRef(null);
  const gender = useRef(null);
  const password = useRef(null);
  const router = useRouter();

  const { authState } = useContext(AuthContext);


  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("submit");
    try {
      const credentials = {
        email: email.current.value,
        password: password.current.value,
        name: name.current.value,
        lastname: lastname.current.value,
        gender: gender.current.value,
      };

      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_API_HOST}/auth/register`,
        credentials
      );

      alert("Usuario registrado con éxito");
      router.push("/login");
    } catch (error) {
      const { response } = error;
      if (response.status == 400) {
        return alert("Este email ya se encuentra en uso");
      }


      alert("Ha ocurrido un error");
    }
  };

  useEffect(() => {
    if(authState.role) {
      if(authState.role === 'worker') {
        router.push('/work')
      }

      if(authState.role === 'owner') {
        router.push('/owner')
      }

      if(authState.role === 'admin') {
        router.push('/admin/users')
      }
    }
  })

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
                className={styles.form_groups_input}
                type="text"
                id="email"
                autoComplete="off"
                ref={email}
                required
              />
            </div>

            <div className={styles.form_groups}>
              <label htmlFor="name">Nombre: </label>
              <input
                className={styles.form_groups_input}
                type="text"
                id="name"
                autoComplete="off"
                required
                ref={name}
              />
            </div>

            <div className={styles.form_groups}>
              <label htmlFor="lastname">Apellido: </label>
              <input
                className={styles.form_groups_input}
                type="text"
                id="lastname"
                autoComplete="off"
                required
                ref={lastname}
              />
            </div>

            <div className={`${styles.form_groups}`}>
              <label htmlFor="gender">genero: </label>
              <select
                ref={gender}
                className="form-control"
                name="gender"
                id="gender"
                required
              >
                <option value="">Selecciona un genero</option>
                <option value="M">Masculino</option>
                <option value="F">Femenino</option>
                <option value="O">Otros</option>
              </select>
            </div>

            <div className={styles.form_groups}>
              <label htmlFor="password">Contraseña: </label>
              <input
                className={styles.form_groups_input}
                type="password"
                id="password"
                ref={password}
                required
              />
            </div>

            <div>
              <input
                type="submit"
                className={`${styles.login_button} main_button`}
                value="Registrarse"
              />
            </div>
          </form>
        </div>
      </main>
      <footer className={styles.login_footer}>
        <h5>by @firstbusinesscorp</h5>
      </footer>
    </>
  );
};

export default Register;
