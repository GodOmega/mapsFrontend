import { useState, useEffect, useContext, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Modal, Button } from "react-bootstrap";

import styles from "../../../../../styles/pages/onwer/enterpriseGroup.module.css";
import MainHeader from "../../../../../components/ui/MainHeader";
import getGroupService from "../../../../../services/group/getGroup.service";

import { AuthContext } from "../../../../../stores/authContext";
import {
  socket,
  connectSocket,
  joinRoom,
  disconnect,
} from "../../../../../services/socket.service";
import updateGroupService from "../../../../../services/group/updateGroup.service";

const group = () => {
  const [group, setGroup] = useState(null);
  const [workersOnline, setWorkersOnline] = useState([]);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const router = useRouter();
  const { id, group_id } = router.query;
  const groupName = useRef();

  const {
    authState: { acces_token },
  } = useContext(AuthContext);

  const handleBack = () => {
    disconnect();
    router.back();
  };

  const handleOpenUpdateModal = () => setShowUpdateModal(true);
  const handleCloseUpdateModal = () => setShowUpdateModal(false);

  const handleGroupSubmit = async (e) => {
    e.preventDefault();

    const groupData = {
      name: groupName.current.value,
      enterpriseId: id,
    };

    try {
      const { data } = await updateGroupService(id, acces_token, groupData);
      setGroup(data);
      handleCloseUpdateModal();
      alert("Grupo actualizado");
    } catch (error) {
      alert("Ocurrio un error");
    }
  };

  useEffect(() => {
    if (!group) {
      Promise.all([getGroupService(acces_token, group_id)])
        .then(([group]) => {
          setGroup(group);
        })
        .catch((err) => {
          console.log(err);
        });
    }

    if (socket) {
      if (group) {
        joinRoom({
          enterpriseId: group.enterpriseId,
          groupId: group.id,
        });
        socket.on("room_workers", (data) => {
          console.log(data);
          setWorkersOnline(data);
        });
      }
    }
    if (!socket) {
      connectSocket({ acces_token });
    }
  }, [group_id, acces_token, group]);

  return (
    <>
      <MainHeader />
      <main className={styles.container}>
        {/* User information section */}

        {group && (
          <>
            <section
              className={`${styles.user_info__section} ${styles.sections}`}
            >
              <div className={`${styles.user__info_container} container_width`}>
                <div>
                  <h2>{group.name}</h2>
                </div>
              </div>
            </section>

            <section className={`${styles.sections}`}>
              <div className={` container_width`}>
                <div className={styles.enterprise__actions}>
                  {group.perimeter && (
                    <Link
                      href={`/owner/enterprise/${id}/group/${group_id}/perimeter`}
                    >
                      <button
                        className={`main_button ${styles.button_primary}`}
                      >
                        Actualizar perimetro
                      </button>
                    </Link>
                  )}

                  {!group.perimeter && (
                    <Link
                      href={`/owner/enterprise/${id}/group/${group_id}/perimeter`}
                    >
                      <button
                        className={`main_button ${styles.button_secondary}`}
                      >
                        Agregar perimetro
                      </button>
                    </Link>
                  )}

                  <button
                    className={`main_button btn-info`}
                    onClick={handleOpenUpdateModal}
                  >
                    Editar Grupo
                  </button>

                  <button
                    onClick={handleBack}
                    className={`main_button ${styles.button_back}`}
                  >
                    Volver
                  </button>
                </div>
              </div>
            </section>

            <section
              className={`${styles.sections} ${styles.employees__section}`}
            >
              <div className={`container_width`}>
                <h2>Empleados conectados: </h2>

                <div className={styles.employees_container}>
                  {workersOnline.length > 0 &&
                    workersOnline.map(({ name, client }) => (
                      <div key={client}>
                        <h3>{name}</h3>
                      </div>
                    ))}

                  {!workersOnline.length && (
                    <div>
                      <h3>0 conectados</h3>
                    </div>
                  )}
                </div>
              </div>
            </section>
          </>
        )}
      </main>
      <Modal show={showUpdateModal} onHide={handleCloseUpdateModal}>
        <Modal.Header closeButton>
          <Modal.Title>Editar grupo</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleGroupSubmit}>
            <div className="row">
              <div className="form-group">
                <label htmlFor="name_group">Nombre</label>
                <input
                  className="form-control"
                  ref={groupName}
                  name="name"
                  id="name_group"
                  required
                  type="text"
                />
              </div>
            </div>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseUpdateModal}>
                cancelar
              </Button>
              <input
                type="submit"
                className="btn btn-primary"
                value="actualizar"
              />
            </Modal.Footer>
          </form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default group;
