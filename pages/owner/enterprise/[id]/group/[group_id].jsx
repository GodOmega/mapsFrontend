import { useState, useEffect, useContext, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Modal, Button } from "react-bootstrap";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import TablePagination from "@mui/material/TablePagination";

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
import deleteGroupService from "../../../../../services/group/deleteGroup.service";
import addEmployeeService from "../../../../../services/group/addEmployee.service";

import { UserLoggedContext } from "../../../../../stores/userLoggedContext";
import getEmployeesWithTime from "../../../../../services/group/getEmployeesWithTime";
import removeEmployee from "../../../../../services/enterprise/removeEmployee";

const group = () => {
  const [group, setGroup] = useState(null);
  const [workersOnline, setWorkersOnline] = useState([]);
  const [employeesWithTimes, setEmployeesWithTimes] = useState(null);
  const [showDeleteEmployeeAlert, setShowDeleteEmployeeAlert] = useState(false);
  const [showEmployeeAddedAlert, setShowEmployeeAddedAlert] = useState(false);
  const [showEmployeeAddedError, setShowEmployeeAddedError] = useState(false);
  const [loadingData, setLoadingData] = useState(false);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // MODAL STATES
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEmployeeModal, setShowEmployeeModal] = useState(false);
  const [showGetEmployeesModal, setShowGetEmployeesModal] = useState(false);

  // REFS
  const groupName = useRef();
  const employeEmail = useRef();

  const router = useRouter();
  const { id, group_id } = router.query;

  const {
    authState: { acces_token, role },
    loggoutAuth,
  } = useContext(AuthContext);

  const { userLoggout } = useContext(UserLoggedContext);

  const handleBack = () => {
    disconnect();
    router.back();
  };

  // MODAL STATE MANAGE
  const handleOpenUpdateModal = () => setShowUpdateModal(true);
  const handleCloseUpdateModal = () => setShowUpdateModal(false);

  const handleOpenDeleteModal = () => setShowDeleteModal(true);
  const handleCloseDeleteModal = () => setShowDeleteModal(false);

  const handleOpenEmployeeModal = () => setShowEmployeeModal(true);
  const handleCloseEmployeeModal = () => setShowEmployeeModal(false);

  const handleOpenShowGetEmployeesModal = () => {
    setShowGetEmployeesModal(true);
    handleEmployees();
  };

  const handleCloseShowGetEmployeesModal = () => {
    setEmployeesWithTimes(null);
    setShowGetEmployeesModal(false);
  };

  // HANDLE FUNCTIONS

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleEmployees = async () => {
    try {
      let employeesArray = [];
      const getData = {
        enterpriseId: id,
      };
      const { data } = await getEmployeesWithTime(getData, acces_token);

      setLoadingData(true);

      for (const employee of data) {
        const workTime = handleWorkTimeEmployee(employee?.employeeTime);
        const lunchTime = handleLunchTimeEmployee(employee?.employeeTime);

        const employeeData = {
          name: employee.name,
          lastname: employee.lastname,
          employeeId: employee.employee.id,
          workTime,
          lunchTime,
        };

        employeesArray = [...employeesArray, employeeData];
      }
      setTimeout(() => {
        setEmployeesWithTimes(employeesArray);
        setLoadingData(false);
      }, 2500);
    } catch (error) {
      console.log(error);
    }
  };

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
      setShowEmployeeAddedAlert(true)
      e.target.reset();
      setTimeout(() => {
        handleResetAlerts()
      }, 3000);
    } catch (error) {
      const { response } = error;
      e.target.reset()
      if (response.status === 401) {
        loggoutAuth();
        userLoggout();
        router.push("/login");
      }

      if (response.status == 400) {
        setTimeout(() => {
          handleResetAlerts()
        }, 3000);
        return setShowEmployeeAddedError(true)
      }

      if (response.status === 404) {
        return alert("Usuario no encontrado");
      }

      alert("Ha ocurrido un error agregando al empleado");
    }
  };

  const handleWorkTimeEmployee = (times = null) => {
    if (times?.work.hours === 0 && times?.work.minutes === 0) {
      return "0";
    }

    if (times?.work.hours > 0) {
      return `${times.work.hours} horas`;
    }

    if (times?.work.minutes > 0) {
      return `${times.work.minutes} minutos`;
    }
  };

  const handleLunchTimeEmployee = (times = null) => {
    if (times?.lunch.hours === 0 && times?.lunch.minutes === 0) {
      return "0";
    }

    if (times?.lunch.hours > 0) {
      return `${times?.lunch.hours} horas`;
    }

    if (times?.lunch.minutes > 0) {
      return `${times?.lunch.minutes} minutos`;
    }
  };

  const handleDeleteEmployee = async (employeeId) => {
    try {
      const employeeData = {
        enterpriseId: id,
        employeeId
      };
      const { data } = await removeEmployee(employeeData, acces_token);
      handleEmployees();
      setShowDeleteEmployeeAlert(true)

      setTimeout(() => {
        setShowDeleteEmployeeAlert(false)
      }, 2500);
    } catch (error) {
      console.log(error);
    }
  }

  const handleResetAlerts = () => {
    setShowEmployeeAddedAlert(false)
    setShowEmployeeAddedError(false)
  }

  useEffect(() => {
    if (role) {
      if (!group) {
        Promise.all([getGroupService(acces_token, group_id)])
          .then(([group]) => {
            setGroup(group);
          })
          .catch((error) => {
            const { response } = error;

            if (response.status === 401) {
              loggoutAuth();
              userLoggout();
              router.push("/login");
            }
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
  }, [group_id, acces_token, group, role]);

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

            {/* BUTTONS SECTION */}
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
                    className={`main_button btn-warning`}
                    onClick={handleOpenShowGetEmployeesModal}
                  >
                    ver empleados
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

      {/* ADD EMPLOYEE MODAL */}
      <Modal show={showEmployeeModal} onHide={handleCloseEmployeeModal}>
        <Modal.Header closeButton>
          <Modal.Title>Agregar empleado al grupo</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleAddEmployee}>
            {showEmployeeAddedAlert && <div className="alert alert-success">Empleado agregado cón exito</div>}
            {showEmployeeAddedError && <div className="alert alert-danger">Este empleado ya pertenece a un grupo o empresa</div>}
            <div className="row">
              <div className="form-group">
                <label htmlFor="user_email">Email</label>
                <input
                  className="form-control"
                  ref={employeEmail}
                  name="email"
                  id="user_email"
                  required
                  type="email"
                  autoComplete="off"
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

      {/* GET GROUP EMPLOYEES MODAL */}
      <Modal
        show={showGetEmployeesModal}
        onHide={handleCloseShowGetEmployeesModal}
      >
        <Modal.Header closeButton>
          <Modal.Title>Empleados del grupo</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {showDeleteEmployeeAlert && (
            <div className=" alert alert-danger">
              Empleado eliminado con éxito
            </div>
          )}

          {(employeesWithTimes?.length > 0 ) && (
            <Paper sx={{ width: "100%", overflow: "hidden" }}>
              <TableContainer>
                <Table
                  sx={{ minWidth: 650 }}
                  size="small"
                  aria-label="a dense table"
                >
                  <TableHead>
                    <TableRow>
                      <TableCell>Nombre</TableCell>
                      <TableCell align="right">Tiempo de trabajo</TableCell>
                      <TableCell align="right">Tiempo de almuerzo</TableCell>
                      <TableCell align="right">Acciones</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {employeesWithTimes
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                      .map((row) => (
                        <TableRow
                          key={row.name}
                          sx={{
                            "&:last-child td, &:last-child th": { border: 0 },
                          }}
                        >
                          <TableCell component="th" scope="row">
                            {row.name} {row.lastname}
                          </TableCell>
                          <TableCell align="right">{row.workTime}</TableCell>
                          <TableCell align="right">{row.lunchTime}</TableCell>
                          <TableCell align="right">
                            <button onClick={() => handleDeleteEmployee(row.employeeId)} className="btn btn-sm btn-danger">
                              Delete
                            </button>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>

              <TablePagination
                rowsPerPageOptions={[5, 15, 35]}
                component="div"
                count={employeesWithTimes.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </Paper>
          )}

          {!loadingData && (employeesWithTimes?.length == 0) && (
            <div>
              0 empleados encontrados
            </div>
          )}

          {loadingData && <div className="">Cargando...</div>}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={handleCloseShowGetEmployeesModal}
          >
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default group;
