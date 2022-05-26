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
import getGroupEmployeesService from "../../../../../services/group/getGroupEmployees.service";
import deleteGroupService from "../../../../../services/group/deleteGroup.service";
import addEmployeeService from "../../../../../services/group/addEmployee.service";

const group = () => {
  const [group, setGroup] = useState(null);
  const [workersOnline, setWorkersOnline] = useState([]);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEmployeeModal, setShowEmployeeModal] = useState(false);

  // REFS
  const groupName = useRef();
  const employeEmail = useRef();

  const router = useRouter();
  const { id, group_id } = router.query;

  const {
    authState: { acces_token },
  } = useContext(AuthContext);

  const handleBack = () => {
    disconnect();
    router.back();
  };

  const handleOpenUpdateModal = () => setShowUpdateModal(true);
  const handleCloseUpdateModal = () => setShowUpdateModal(false);

  const handleOpenDeleteModal = () => setShowDeleteModal(true);
  const handleCloseDeleteModal = () => setShowDeleteModal(false);

  const handleOpenEmployeeModal = () => setShowEmployeeModal(true);
  const handleCloseEmployeeModal = () => setShowEmployeeModal(false);

  const handleGroupSubmit = async (e) => {
    e.preventDefault();

    const groupData = {
      name: groupName.current.value,
    };

    try {
      const { data } = await updateGroupService(
        group_id,
        acces_token,
        groupData
      );
      setGroup(data);
      handleCloseUpdateModal();
      alert("Grupo actualizado");
    } catch (error) {
      const { response } = error;
      if (response.status === 401) {
        loggoutAuth();
        userLoggout();
        router.push("/login");
      }
      alert("Ocurrio un error");
    }
  };

  const handleDeleteGroup = async (e) => {
    e.preventDefault();
    try {
      await deleteGroupService(group_id, acces_token);
      router.back();
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

  const handleAddEmployee = async (e) => {
    e.preventDefault();
    try {
      const employeeDta = {
        email: employeEmail.current.value,
        enterpriseId: id,
        enterpriseGroupId: group_id,
      };
      const { data } = await addEmployeeService(employeeDta, acces_token);
      alert("Empleado agregado a la empresa y al grupo");
    } catch (error) {
      const { response } = error;
      if (response.status === 401) {
        loggoutAuth();
        userLoggout();
        router.push("/login");
      }
      alert("Ha ocurrido un error agregando al empleado");
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
                    className={`main_button btn-success`}
                    onClick={handleOpenEmployeeModal}
                  >
                    Agregar empleado
                  </button>

                  <button
                    onClick={handleOpenDeleteModal}
                    className={`main_button btn-danger`}
                  >
                    Eliminar grupo
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
                    workersOnline.map(({ name, client, lastname }) => (
                      <div key={client}>
                        <h3>
                          {name} {lastname}{" "}
                        </h3>
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

      {/* UPDATE GROUP MODAL */}
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

      {/* DELETE GROUP MODAL */}

      <Modal show={showDeleteModal} onHide={handleCloseDeleteModal}>
        <Modal.Header closeButton>
          <Modal.Title>Eliminar grupo</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleDeleteGroup}>
            <h3>¿Esta seguro que desea eliminar este grupo?</h3>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseDeleteModal}>
                cancelar
              </Button>
              <input
                type="submit"
                className="btn btn-primary"
                value="Eliminar grupo"
              />
            </Modal.Footer>
          </form>
        </Modal.Body>
      </Modal>

      <Modal show={showEmployeeModal} onHide={handleCloseEmployeeModal}>
        <Modal.Header closeButton>
          <Modal.Title>Agregar empleado al grupo</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleAddEmployee}>
            <div className="row">
              <div className="form-group">
                <label htmlFor="user_email">email</label>
                <input
                  className="form-control"
                  ref={employeEmail}
                  name="email"
                  id="user_email"
                  required
                  type="email"
                />
              </div>
            </div>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseEmployeeModal}>
                cancelar
              </Button>
              <input
                type="submit"
                className="btn btn-primary"
                value="Agregar empleado"
              />
            </Modal.Footer>
          </form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default group;
