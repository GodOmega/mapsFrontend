import { useContext, useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Modal, Button, Table } from "react-bootstrap";

import { AuthContext } from "../../../stores/authContext";
import MainHeader from "../../../components/ui/MainHeader";
import LargeTimeModal from "../../../components/elements/LargeTimeModal";

// Service
import getEnterpriseService from "../../../services/owner/getEnterprise.service";

import styles from "../../../styles/pages/onwer/enterprise.module.css";
import createGroupService from "../../../services/group/createGroup.service";
import { updateEnterprise } from "../../../services/enterprise/enterprise.services";
import { UserLoggedContext } from "../../../stores/userLoggedContext";
import getEmployee from "../../../services/enterprise/getEmployee";
import removeEmployee from "../../../services/enterprise/removeEmployee";

const Enterprise = () => {
  const [enterprise, setEnterprise] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showLargeTimeModal, setShowLargeTimeModal] = useState(false);

  const [getEmployeeWithTime, setGetEmployeeWithTime] = useState(null);
  const [getEmployeeMessage, setGetEmployeeMessage] = useState([]);

  // REFERENCIAS
  const groupName = useRef("");
  const enterpriseName = useRef("");
  const userEmail = useRef("");
  const form = useRef();

  const router = useRouter();
  const {
    authState: { acces_token, role },
    loggoutAuth,
  } = useContext(AuthContext);

  const { userLoggout } = useContext(UserLoggedContext);

  const { id } = router.query;

  const handleOpenCreateModal = () => setShowCreateModal(true);
  const handleCloseCreateModal = () => setShowCreateModal(false);

  const handleOpenUpdateModal = () => setShowUpdateModal(true);
  const handleCloseUpdateModal = () => setShowUpdateModal(false);

  const handleOpenUserModal = () => setShowUserModal(true);
  const handleCloseUserModal = () => setShowUserModal(false);

  const handleOpenLargeTimeModal = () => setShowLargeTimeModal(true);
  const handleCloseLargeTimeModal = () => setShowLargeTimeModal(false);

  const getWorkTimeEmployee = () => {
    if (
      getEmployeeWithTime.work.hours === 0 &&
      getEmployeeWithTime.work.minutes === 0
    ) {
      return "0";
    }

    if (getEmployeeWithTime.work.hours > 0) {
      return `${getEmployeeWithTime.work.hours} horas`;
    }

    if (getEmployeeWithTime.work.minutes > 0) {
      return `${getEmployeeWithTime.work.minutes} minutos`;
    }
  };

  const getLunchTimeEmployee = () => {
    if (
      getEmployeeWithTime.lunch.hours === 0 &&
      getEmployeeWithTime.lunch.minutes === 0
    ) {
      return "0";
    }

    if (getEmployeeWithTime.lunch.hours > 0) {
      return `${getEmployeeWithTime.lunch.hours} horas`;
    }

    if (getEmployeeWithTime.lunch.minutes > 0) {
      return `${getEmployeeWithTime.lunch.minutes} minutos`;
    }
  };

  const handleGroupSubmit = async (e) => {
    e.preventDefault();
    const groupData = {
      name: groupName.current.value,
      enterpriseId: id,
    };

    try {
      await createGroupService(id, acces_token, groupData);
      handleCloseCreateModal();
      const { data } = await getEnterpriseService(acces_token, id);
      setEnterprise(data);
      alert("Grupo creado con éxito");
    } catch (error) {
      if (response.status === 401) {
        loggoutAuth();
        userLoggout();
        router.push("/login");
      }
      alert("Ocurrio un error");
    }
  };

  const handleEnterpriseSubmit = async (e) => {
    e.preventDefault();

    const changes = {
      name: enterpriseName.current.value,
    };

    try {
      const { data } = await updateEnterprise(id, acces_token, changes);
      setEnterprise(data);
      enterpriseName.current.value = "";
      handleCloseUpdateModal();
      alert("Empresa actualizada con éxito");
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

  const handleUserEmailSubmit = async (e) => {
    e.preventDefault();
    try {
      const getData = {
        enterpriseId: parseInt(id),
        email: userEmail.current.value,
      };

      setGetEmployeeWithTime(null);
      setGetEmployeeMessage([]);
      const { data } = await getEmployee(getData, acces_token);
      setGetEmployeeWithTime(data);
    } catch (error) {
      const { response } = error;

      if (response.status === 404) {
        return setGetEmployeeMessage(["empleado no encontrado"]);
      }

      if (response.status === 401) {
        loggoutAuth();
        userLoggout();
        router.push("/login");
      }
    }
  };

  const handleRemoveEmployee = async () => {
    if (getEmployeeWithTime) {
      try {
        const employeeData = {
          enterpriseId: id,
          employeeId: getEmployeeWithTime.id,
        };
        const { data } = await removeEmployee(employeeData, acces_token);
        setGetEmployeeWithTime(null);
        alert("Empleado removido de la empresa");
      } catch (error) {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    if (role) {
      if (acces_token) {
        Promise.all([getEnterpriseService(acces_token, id)])
          .then(([enterprise]) => {
            const { data } = enterprise;
            setEnterprise(data);
          })
          .catch((err) => {
            const { response } = err;
            if (response.status === 401) {
              loggoutAuth();
              userLoggout();
              router.push("/login");
            }
            alert("Ha ocurrido un error");
          });
      }
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
  }, [id, acces_token, role]);

  return (
    <>
      <MainHeader />
      <main className={styles.container}>
        {/* User information section */}

        {enterprise && (
          <>
            <section
              className={`${styles.user_info__section} ${styles.sections}`}
            >
              <div className={`${styles.user__info_container} container_width`}>
                <div>
                  <h2>{enterprise.name}</h2>
                </div>
              </div>
            </section>

            <section className={`${styles.sections}`}>
              <div className={` container_width`}>
                <div className={styles.enterprise__actions}>
                  <button
                    onClick={handleOpenUserModal}
                    className={`main_button ${styles.button_primary}`}
                  >
                    Ver empleado
                  </button>

                  <button
                  onClick={handleOpenLargeTimeModal}
                    className={`main_button btn-warning`}
                  >
                    Ver tiempo a largo plazo
                  </button>

                  <button
                    onClick={handleOpenUpdateModal}
                    className={`main_button ${styles.button_secondary}`}
                  >
                    Editar empresa
                  </button>

                  <button
                    onClick={handleOpenCreateModal}
                    className={`main_button btn-info`}
                  >
                    Crear grupo de trabajo
                  </button>

                  <Link href="/owner/">
                    <button className={`main_button ${styles.button_back}`}>
                      Volver
                    </button>
                  </Link>
                </div>
              </div>
            </section>

            {/* ENTERPRISE GROUPS SECTION */}

            <section className={`${styles.sections} ${styles.groups__section}`}>
              <div className={` container_width`}>
                <h2>Grupos de la empresa: </h2>
                <div className={styles.groups__container}>
                  {enterprise &&
                    enterprise.groups.map((group) => (
                      <div key={group.id} className={styles.group__item}>
                        <h3>{group.name}</h3>
                        <Link
                          href={`/owner/enterprise/${id}/group/${group.id}`}
                        >
                          <a className={``}>Ver detalles</a>
                        </Link>
                      </div>
                    ))}
                </div>
              </div>
            </section>
          </>
        )}

        {/* CREATE GROUP MODAL */}

        <Modal show={showCreateModal} onHide={handleCloseCreateModal}>
          <Modal.Header closeButton>
            <Modal.Title>Crear grupo</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form ref={form} onSubmit={handleGroupSubmit}>
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
                <Button variant="secondary" onClick={handleCloseCreateModal}>
                  cancelar
                </Button>
                <input
                  type="submit"
                  className="btn btn-primary"
                  value={"crear"}
                />
              </Modal.Footer>
            </form>
          </Modal.Body>
        </Modal>

        {/* UPDATE ENTERPRISE MODAL */}

        <Modal show={showUpdateModal} onHide={handleCloseUpdateModal}>
          <Modal.Header closeButton>
            <Modal.Title>Editar empresa</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form onSubmit={handleEnterpriseSubmit}>
              <div className="row">
                <div className="form-group">
                  <label htmlFor="name_enterprise">Nombre</label>
                  <input
                    className="form-control"
                    ref={enterpriseName}
                    name="name"
                    id="name_enterprise"
                    required
                    type="text"
                    autoComplete="off"
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
                  value={"actualizar empresa"}
                />
              </Modal.Footer>
            </form>
          </Modal.Body>
        </Modal>

        {/* VER EMPLEADO */}
        <Modal show={showUserModal} onHide={handleCloseUserModal}>
          <Modal.Header closeButton>
            <Modal.Title>Ver usuario de la empresa</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form onSubmit={handleUserEmailSubmit}>
              <div className="row">
                <div className="form-group">
                  <label htmlFor="employee_email">Email del empleado</label>
                  <input
                    className="form-control mb-2"
                    ref={userEmail}
                    name="email"
                    id="employee_email"
                    required
                    type="email"
                    autoComplete="off"
                  />
                </div>
              </div>
              {getEmployeeWithTime && (
                <Table striped bordered hover size="sm">
                  <thead>
                    <tr>
                      <th>Nombre</th>
                      <th>Apellido</th>
                      <th>Horas trabajo (hoy)</th>
                      <th>Horas almuerzo (hoy)</th>
                      <th>actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {getEmployeeWithTime && (
                      <tr>
                        <td>{getEmployeeWithTime.name}</td>
                        <td>{getEmployeeWithTime.lastname}</td>
                        <td>{getWorkTimeEmployee()}</td>
                        <td>{getLunchTimeEmployee()}</td>
                        <td>
                          <button
                            onClick={handleRemoveEmployee}
                            type="button"
                            className="btn btn-sm btn-danger"
                          >
                            delete
                          </button>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              )}

              {getEmployeeMessage.length > 0 && (
                <div className="alert alert-danger">
                  {getEmployeeMessage.map((item) => (
                    <p key={new Date()} className="m-0 p-0">
                      {item}
                    </p>
                  ))}
                </div>
              )}

              <Modal.Footer>
                <Button variant="secondary" onClick={handleCloseUserModal}>
                  cancelar
                </Button>
                <input
                  type="submit"
                  className="btn btn-primary"
                  value={"Buscar empleado"}
                />
              </Modal.Footer>
            </form>
          </Modal.Body>
        </Modal>

        {/* TIEMPO DE EMPLEADO EN SEMANA O MES*/}
        <Modal show={showLargeTimeModal} onHide={handleCloseLargeTimeModal}>
          <Modal.Header closeButton>
            <Modal.Title>Ver usuario de la empresa</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <LargeTimeModal />
          </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={handleCloseLargeTimeModal}>
                  cancelar
                </Button>
              </Modal.Footer>
        </Modal>
      </main>
    </>
  );
};

export default Enterprise;
