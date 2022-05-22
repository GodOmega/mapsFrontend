import { useState, useEffect, useContext } from "react";
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

import { socket, joinWork, connectSocket } from "../services/socket.service";

const work = () => {
  const [userPosition, setUserPosition] = useState(null);
  const { userState } = useContext(UserLoggedContext);
  const [connected, setConnected] = useState(null);

  // STATES
  const {
    authState: { acces_token },
  } = useContext(AuthContext);
  const [perimeter, setPerimeter] = useState(null);

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
      // if (preState) {
      //   if (newPosition) {
      //     testVerify(newPosition);
      //   }
      // }
      return newPosition;
    });
  };

  const handleJoinWork = () => {
    if (perimeter) {
      joinWork({
        group: userState.employe?.enterpriseGroupId,
        employeId: userState.employe?.id,
        enterpriseId: userState.employe?.enterpriseId,
        employeRole: userState.employe?.role,
        name: userState.name,
      });
      setConnected(true);
    }
  };

  useEffect(() => {
    const location = navigator.geolocation.watchPosition(
      handlerUserPosition,
      error,
      options
    );

    if (userState.employe?.enterpriseGroupId) {
      if (!perimeter) {
        Promise.all([
          getGroupService(acces_token, userState.employe?.enterpriseGroupId),
        ])
          .then(([group]) => {
            if (group.perimeter) {
              setPerimeter(JSON.parse(group.perimeter));
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }
    }

    if (!socket) {
      connectSocket({
        acces_token,
      });
    }

    return () => {
      navigator.geolocation.clearWatch(location);
    };
  }, [userState, acces_token, socket]);

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

            <div className={styles.work_time_container}>
              <p>00:25:34 horas</p>
            </div>

            <div className={styles.work_actions}>
              <button
                onClick={handleJoinWork}
                className={`main_button ${styles.work_actions__start_work}`}
              >
                Reportar Ingreso
              </button>
              {/* <button
                className={`main_button ${styles.work_actions__pause_work}`}
              >
                Reportar Lunch
              </button>
              <button
                className={`main_button ${styles.work_actions__stop_work}`}
              >
                Reportar Salida
              </button> */}
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
    </>
  );
};

export default work;
