import { useRef, useContext, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";

import { AuthContext } from "../stores/authContext";
import { UserLoggedContext } from "../stores/userLoggedContext";

import styles from "../styles/pages/login.module.css";

import GreetingsIcon from "../components/ui/icons/GreetingsIcon";
import MainSuperiorBar from "../components/elements/MainSuperiorBar";

const login = () => {
  const email = useRef(null);
  const password = useRef(null);
  const router = useRouter();

  const { login, authState } = useContext(AuthContext);
  const { userLogged } = useContext(UserLoggedContext);


  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("submit");
    try {
      const credentials = {
        email: email.current.value,
        password: password.current.value,
      };

      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_API_HOST}/auth/login`,
        credentials
      );

      const { acces_token } = data;
      const { role, username, name, lastname, enterprises, employe, image } =
        data.user;

      login({ role, username, acces_token });
      userLogged({
        name,
        lastname,
        enterprises,
        employe,
        image,
      });

      if (role === "owner") {
        router.push("/owner");
      }

      if (role === "worker") {
        router.push("/work");
      }

      if(role === "admin"){
        router.push("/admin/users");
      } 
    } catch (error) {
      alert('Usuario o contraseña icorrectos')
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
  }, [authState])

  return (
    <>
      <header className="header_main">
        <MainSuperiorBar />
      </header>
      <main className={styles.main_container}>
        <div className="container_width">
          <div className={styles.icon_container}>
            <GreetingsIcon fill="#79c471" />
          </div>

          <form onSubmit={handleSubmit}>
            <div className={styles.form_groups}>
              <label htmlFor="email">Email: </label>
              <input
                type="text"
                id="email"
                autoComplete="off"
                ref={email}
                required
              />
            </div>

            <div className={styles.form_groups}>
              <label htmlFor="password">Contraseña: </label>
              <input type="password" id="password" ref={password} required />
            </div>

            <div>
              <input
                type="submit"
                className={`${styles.login_button} main_button`}
                value="ingresar"
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

export default login;
