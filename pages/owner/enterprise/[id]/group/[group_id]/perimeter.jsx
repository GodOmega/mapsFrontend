import { useState, useEffect, useContext } from "react";
import dynamic from "next/dynamic";
import axios from "axios";

import { useRouter } from "next/router";

import getGroupService from "../../../../../../services/group/getGroup.service";
import { AuthContext } from "../../../../../../stores/authContext";
import MainHeader from "../../../../../../components/ui/MainHeader";

import styles from "../../../../../../styles/pages/onwer/group/editPerimeter.module.css";
import { config } from "localforage";

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
    authState: { acces_token },
  } = useContext(AuthContext);

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

  const handleSubmit = (token) => {
    const config = {
      headers: { Authorization: `Bearer ${token}` },
      input
    };

    axios
      .put(`${process.env.API_HOST}/enterprises/groups/${group_id}`, input, config)
      .then((data) => {
        alert('Perimetro actualizado')
      })
      .catch((error) => {
        alert('ocurrio un error')
      });
  }

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(getPosition, error, options);

    Promise.all([getGroupService(acces_token, group_id)])
      .then(([group]) => {
        if (group?.perimeter) {
          setOldPerimeter(JSON.parse(group.perimeter));
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, [group_id, acces_token]);

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
              <button onClick={() => handleSubmit(acces_token)} className={`main_button ${styles.buttons} ${styles.button_primary}`}>
              Actualizar perimetro
            </button>
            )}
            <button onClick={() => router.back()} className={`main_button ${styles.buttons} ${styles.button_back}`}>
              Volver
            </button>
          </div>
        </section>
      </main>
    </>
  );
};

export default perimeter;
