import { useState, useEffect, useContext } from "react";
import dynamic from "next/dynamic";

import { useRouter } from "next/router";

import { AuthContext } from "../../../../../../stores/authContext";
import { UserLoggedContext } from "../../../../../../stores/userLoggedContext";

import MainHeader from "../../../../../../components/ui/MainHeader";

import styles from "../../../../../../styles/pages/onwer/group/editPerimeter.module.css";

// Services
import getGroupService from "../../../../../../services/group/getGroup.service";
import updateGroupService from "../../../../../../services/group/updateGroup.service";
const MapPerimeter = dynamic(
  () => import("../../../../../../components/elements/MapPerimeter"),
  {
    ssr: false,
  }
);

const perimeter = () => {
  const [perimeter, setPerimeter] = useState(null);
  const [oldPerimeter, setOldPerimeter] = useState(null);
  const [currentPosition, setCurrentPosition] = useState(null);
  const [input, setInput] = useState(null);

  const router = useRouter();
  const { group_id } = router.query;

  const {
    authState: { acces_token, role },
    loggoutAuth
  } = useContext(AuthContext);

  const {userLoggout} = useContext(UserLoggedContext)
  const options = {
    enableHighAccuracy: true,
    timeout: 8000,
  };

  const error = (error) => {
    console.log(error);
  };

  const getPosition = ({ coords }) => {
    if (coords) {
      const { latitude, longitude } = coords;

      setCurrentPosition({ latitude, longitude });
    }
  };

  const handleCreatePerimeter = (coords) => {
    const { _northEast, _southWest } = coords.layer._bounds;

    setPerimeter({
      north: _northEast,
      south: _southWest,
    });

    const inputCoords = JSON.stringify([
      [_northEast.lat, _northEast.lng],
      [_southWest.lat, _southWest.lng],
    ]);

    setInput({
      perimeter: inputCoords,
    });
  };

  const handleDeletePerimeter = () => {
    setPerimeter(null);
  };

  const handleSubmit = async (token) => {
    try {
      await updateGroupService(group_id, token, input);
      alert("Perimetro actualizado");
    } catch (error) {
      alert("Ocurrio un error al actualizar");
    }
  };

  useEffect(() => {
    
    if (role) {
      navigator.geolocation.getCurrentPosition(getPosition, error, options);
      Promise.all([getGroupService(acces_token, group_id)])
        .then(([group]) => {
          if (group?.perimeter) {
            setOldPerimeter(JSON.parse(group.perimeter));
          }
        })
        .catch((error) => {
          const {response} = error

          if(response.status === 401) {
            loggoutAuth()
            userLoggout()
            router.push('/login')
          }

          alert('Ha ocurrido un error')
        });
    }

    const timeout = setTimeout(() => {
      if (role) {
        if (role == "worker") {
          router.push("/work");
        }

        if (role == "admin") {
          router.push("/admin/users");
        }
      }

      if (!role) {
        router.push("/login");
      }
    }, 600);

    return () => {
      clearTimeout(timeout);
    };
  }, [group_id, acces_token, role]);

  return (
    <>
      <MainHeader />
      <main className={styles.container}>
        {/* PERIMETER ACTIONS */}
        <section className={styles.perimeter_section}>
          {currentPosition && (
            <MapPerimeter
              lat={currentPosition.latitude}
              lng={currentPosition.longitude}
              perimeter={perimeter}
              oldPerimeter={oldPerimeter}
              createPerimeter={handleCreatePerimeter}
              deletePerimeter={handleDeletePerimeter}
            />
          )}
          <div className="container_width">
            {perimeter && (
              <button
                onClick={() => handleSubmit(acces_token)}
                className={`main_button ${styles.buttons} ${styles.button_primary}`}
              >
                Actualizar perimetro
              </button>
            )}
            <button
              onClick={() => router.back()}
              className={`main_button ${styles.buttons} ${styles.button_back}`}
            >
              Volver
            </button>
          </div>
        </section>
      </main>
    </>
  );
};

export default perimeter;
