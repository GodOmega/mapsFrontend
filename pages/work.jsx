import { useState, useEffect, useContext, useRef } from "react";
import dynamic from "next/dynamic";
import moment from "moment";
import styles from "../styles/pages/work.module.css";
import MainHeader from "../components/ui/MainHeader";

import fullNameFirstLetter from "../utils/fullNameFirstLetter";

const MapComponent = dynamic(() => import("../components/elements/Map"), {
  ssr: false,
});

import { AuthContext } from "../stores/authContext";
import { UserLoggedContext } from "../stores/userLoggedContext";
import getGroupService from "../services/group/getGroup.service";

import {
  socket,
  joinWork,
  connectSocket,
  disconnectOfWork,
  startLunch,
  stopLunch,
  testMessage
} from "../services/socket.service";

import verifyPerimeter from "../utils/verifyPerimeter";
const work = () => {
  // STATES
  const [userPosition, setUserPosition] = useState(null);
  const [connected, setConnected] = useState(false);
  const [lunchTime, setLunchTime] = useState(false);
  const [perimeter, setPerimeter] = useState(null);

  const { authState, loggoutAuth } = useContext(AuthContext);
  const { userState, userLoggout } = useContext(UserLoggedContext);

  let perimeterForCalc = null;
  let statusConnect = useRef(false);
  const audioElement = useRef(null)

  const acces_token = authState?.acces_token;
  const role = authState?.role;

  //Date format
  const year = moment().format("YY");
  const month = moment().format("MM");
  const day = moment().format("DD");

  const error = (error) => {
    console.error(error);
  };

  const options = {
    enableHighAccuracy: true,
    timeout: 8000,
  };

  const handlerUserPosition = ({ coords }) => {
    const newPosition = {
      lat: coords.latitude,
      lng: coords.longitude,
    };

    setUserPosition((preState) => {
      if (preState) {
        if (newPosition) {
          youAreInPerimeter(newPosition);
        }
      }
      return newPosition;
    });
  };

  const youAreInPerimeter = (position) => {
    if (statusConnect.current && perimeterForCalc.length) {
      const isInPerimeter = verifyPerimeter(position, perimeterForCalc);
      testMessage()
      if (!isInPerimeter) {
        disconnectOfWork();
        setConnected(false);
        statusConnect.current = false;
        alert(
          "Saliste del perimetro y te has desconectado, si deseas reconectar vuelve al perimetroy reporta tu ingreso"
        );
      }
    }
  };

  const handleJoinWork = (position, perimetro) => {
    if (!perimeter) {
      alert("Aun no hay un perimetro disponible");
    }

    if (perimetro && position) {
      const isInPerimeter = verifyPerimeter(position, perimetro);
      if (isInPerimeter) {
        joinWork({
          group: userState.employe?.enterpriseGroupId,
          employeId: userState.employe?.id,
          enterpriseId: userState.employe?.enterpriseId,
          employeRole: userState.employe?.role,
          name: userState.name,
          lastname: userState.lastname,
        });
        statusConnect.current = true;
        if(audioElement.current) {
          audioElement.current.play()
          audioElement.current.volume = 1

        }
        return setConnected(true);
      }

      return alert("No estás en perimetro");
    }
  };

  const handleDisconnectWork = () => {
    if (connected) {
      disconnectOfWork();
      setConnected(false);
      statusConnect.current = false;
    }
  };

  const handleStartLunch = () => {
    if (connected) {
      startLunch();
      statusConnect.current = false;
      setConnected(false);
      setLunchTime(true);
    }
  };

  const handleStopLunch = () => {
    stopLunch();
    setLunchTime(false);
  };

  useEffect(() => {
    let location = navigator.geolocation.watchPosition(
      handlerUserPosition,
      error,
      options
    );
    if (authState?.role === "worker") {
      if (userState.employe?.enterpriseGroupId) {
        if (!perimeter) {
          Promise.all([
            getGroupService(acces_token, userState.employe?.enterpriseGroupId),
          ])
            .then(([group]) => {
              if (group.perimeter) {
                setPerimeter(JSON.parse(group.perimeter));
                perimeterForCalc = JSON.parse(group.perimeter);
              }
            })
            .catch((err) => {
              const { response } = err;
              if (response.status === 401) {
                loggoutAuth();
                userLoggout();
                router.push("/login");
              }
            });
        }
      }

      if (!socket) {
        connectSocket({
          acces_token,
        });
      }
    }

    const timeout = setTimeout(() => {
      if (authState?.role) {
        if (!role) {
          router.push("/login");
        }

        if (role == "owner") {
          router.push("/owner");
        }

        if (role == "admin") {
          router.push("/admin/users");
        }
      }

      if (!authState?.role) {
        router.push("/login");
      }
    }, 600);

    return () => {
      navigator.geolocation.clearWatch(location);
      clearTimeout(timeout);
    };
  }, [userState, acces_token, socket, authState]);

  return (
    <>
      <MainHeader />
      <main className={styles.container}>
        {/* User information section */}

        <section className={`${styles.user_info__section} ${styles.sections}`}>
          <div className={`${styles.user__info_container} container_width`}>
            <div className={styles.user__info_image}>
              <div className="m-0">
                {fullNameFirstLetter(userState.name, userState.lastname)}
              </div>
            </div>

            <div>
              <h3>
                {userState.name} {userState.lastname}
              </h3>
              {connected && <p className="m-0">Estas conectado</p>}
              {lunchTime && <p className="m-0">Estas en Lunch</p>}
            </div>
          </div>
        </section>

        {/* Actions section */}
        <section className={styles.sections}>
          <div className="container_width">
            <div className={styles.date_container}>
              <span>{day}</span>
              <span>•</span>
              <span>{month}</span>
              <span>•</span>
              <span>{year}</span>
            </div>

            <div className={styles.work_actions}>
              {!connected && !lunchTime && (
                <button
                  onClick={() => handleJoinWork(userPosition, perimeter)}
                  className={`main_button ${styles.work_actions__start_work}`}
                >
                  Reportar Ingreso
                </button>
              )}

              {connected && !lunchTime && (
                <button
                  onClick={handleDisconnectWork}
                  className={`main_button ${styles.work_actions__stop_work}`}
                >
                  Reportar Salida
                </button>
              )}

              {connected && !lunchTime && (
                <button
                  onClick={handleStartLunch}
                  className={`main_button ${styles.work_actions__pause_work}`}
                >
                  Reportar Lunch
                </button>
              )}

              {lunchTime && (
                <button
                  onClick={handleStopLunch}
                  className={`main_button ${styles.work_actions__pause_work}`}
                >
                  Terminar Lunch
                </button>
              )}
            </div>
          </div>
        </section>

        {/* Map section */}
        <section
          className={`${styles.sections} ${styles.map__section__container}`}
        >
          <div className={`${styles.map__section__container} container_width`}>
            <h4>Hoy te encuentras en: </h4>
            <div className={styles.map__container}>
              {userPosition && (
                <MapComponent
                  lat={userPosition.lat}
                  lng={userPosition.lng}
                  perimeter={perimeter}
                />
              )}
            </div>
          </div>
        </section>
      </main>
      <div className={styles.audio}>
        <audio  src="/audio/loop.mp3" ref={audioElement} loop controls></audio>
      </div>
    </>
  );
};

export default work;
