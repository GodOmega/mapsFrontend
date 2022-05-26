import Head from "next/head";
import { useRouter } from "next/router";
import { useContext, useState, useRef, useEffect } from "react";
import { Col, Row, Table } from "reactstrap";

import { Modal, Button } from "react-bootstrap";

import FullLayout from "../../components/admin/layouts/FullLayout";
import { AuthContext } from "../../stores/authContext";
import { UserLoggedContext } from "../../stores/userLoggedContext";

// Service
import {
  createUser,
  deleteUser,
  getUserByEmail,
  updateByAdmin,
} from "../../services/users.service";

export default function AdminUsers() {
  const [user, setUser] = useState(null);
  const [userErrMsg, setUserErrMsg] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);

  const router = useRouter();

  // REFS
  const userEmail = useRef(null);

  const createUserEmail = useRef(null);
  const userName = useRef(null);
  const userLastname = useRef(null);
  const userGender = "F";
  const userRole = useRef(null);
  const userPassword = useRef(null);

  const updateEmail = useRef(null);
  const updateName = useRef(null);
  const updateLastname = useRef(null);
  const updateRole = useRef(null);
  const updatePassword = useRef(null);

  const {
    authState: { acces_token, role },
    loggoutAuth,
  } = useContext(AuthContext);

  const { userLoggout } = useContext(UserLoggedContext);

  const openDeleteModal = () => setShowDeleteModal(true);
  const closeDeleteModal = () => setShowDeleteModal(false);

  const openUpdateModal = () => setShowUpdateModal(true);
  const closeUpdateModal = () => setShowUpdateModal(false);

  const handleGetUserSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        email: userEmail.current.value,
      };
      const { data } = await getUserByEmail(payload, acces_token);
      setUser(data);
      userEmail.current.value = "";
      setUserErrMsg(null);
    } catch (error) {
      const { response } = error;
      if (response.status === 404) {
        setUserErrMsg("Usuario no encontrado");
      }

      if (response.status === 401) {
        loggoutAuth();
        userLoggout();
        router.push("/login");
      }
    }
  };

  const hanndleDeleteUser = async (e) => {
    e.preventDefault();

    try {
      const userId = parseInt(user.id);
      const { data } = await deleteUser(userId, acces_token);
      setUser(null);
      setShowDeleteModal(false);
      alert("Usuario eliminado con éxito");
    } catch (error) {
      const { response } = error;
      if (response.status === 401) {
        loggoutAuth();
        userLoggout();
        router.push("/login");
      }
      alert("ocurrio un error al tratar de eliminar");
    }
  };

  const handleChangeGender = (e) => {
    userGender = e.target.value;
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    const payload = {
      email: createUserEmail.current.value,
      name: userName.current.value,
      lastname: userLastname.current.value,
      password: userPassword.current.value,
      role: userRole.current.value,
      gender: userGender,
    };
    try {
      const { data } = await createUser(payload, acces_token);
      alert("Usuario creado con éxito");
      e.target.reset();
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

  const handleUpdateUser = async (e) => {
    e.preventDefault();

    const userData = {
      email: updateEmail.current.value,
      name: updateName.current.value,
      lastname: updateLastname.current.value,
      password: updatePassword.current.value,
      role: updateRole.current.value,
    };

    try {
      const { data } = await updateByAdmin(user?.id, userData, acces_token);
      setShowUpdateModal(false);
      updateEmail.current.value = "";
      updateName.current.value = "";
      updateLastname.current.value = "";
      updatePassword.current.value = "";
      setUser(null);
      alert("Usuario actualizado");
    } catch (error) {
      const { response } = error;
      if (response.status === 401) {
        loggoutAuth();
        userLoggout();
        router.push("/login");
      }
      alert('Ha ocurrido un error al acualizar')
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (role) {
        if (role == "worker") {
          router.push("/work");
        }

        if (role == "owner") {
          router.push("/owner");
        }
      }

      if (!role) {
        router.push("/login");
      }
    }, 600);

    return () => {
      clearTimeout(timeout);
    };
  }, [role]);

  return (
    <FullLayout>
      <div>
        <Head>
          <title>Admin Panel | Usuarios</title>
          <meta
            name="description"
            content="Ample Admin Next Js Free Aadmin Dashboard"
          />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <div>
          <Row className="mb-5">
            <Col sm="6" lg="3">
              <h1>Usuarios</h1>
            </Col>
          </Row>
          <Row className="mb-3">
            <Col sm="12">
              <h5>Buscar usuario</h5>
              {userErrMsg && (
                <div className="alert alert-danger">{userErrMsg}</div>
              )}
            </Col>
            <Col sm="12" className="mb-5">
              <form onSubmit={handleGetUserSubmit}>
                <div className="col-12 col-md-6  form-group mb-3">
                  <label htmlFor="email">Email</label>
                  <input
                    className="form-control"
                    id="email"
                    name="email"
                    ref={userEmail}
                    type="text"
                    required
                  />
                </div>
                <input
                  type="submit"
                  className="btn btn-primary"
                  value="Buscar"
                />
              </form>
            </Col>
            <Col>
              <Table striped bordered hover size="sm">
                <thead>
                  <tr>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {user && (
                    <tr>
                      <td className="text-center">{user.email}</td>
                      <td className="text-center">{user.role}</td>
                      <td>
                        <button
                          onClick={openDeleteModal}
                          className="btn btn-sm mb-2 mx-2 btn-danger"
                        >
                          Delete
                        </button>
                        <button
                          onClick={openUpdateModal}
                          className="btn mx-2 mb-2 btn-sm btn-primary"
                        >
                          Update
                        </button>
                      </td>
                    </tr>
                  )}
                  {!user && (
                    <tr>
                      <td className="text-center" colSpan="4">
                        Sin datos
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </Col>
          </Row>

          <Row>
            <Col sm="12">
              <h5>Crear usuario</h5>
            </Col>
            <Col sm="12">
              <form onSubmit={handleCreateUser}>
                <div className="form-group col-md-6 mb-2">
                  <label htmlFor="userEmail">Email</label>
                  <input
                    className="form-control"
                    type="email"
                    ref={createUserEmail}
                    name="email"
                    id="userEmail"
                    required
                    autoComplete="off"
                  />
                </div>

                <div className="form-group col-md-6 mb-2">
                  <label htmlFor="userName">nombre</label>
                  <input
                    className="form-control"
                    type="text"
                    ref={userName}
                    name="name"
                    id="userName"
                    required
                    autoComplete="off"
                  />
                </div>
                <div className="form-group col-md-6 mb-2">
                  <label htmlFor="userLastname">Apellido</label>
                  <input
                    className="form-control"
                    type="text"
                    ref={userLastname}
                    name="lastname"
                    id="userLastname"
                    required
                    autoComplete="off"
                  />
                </div>

                <div className="form-group col-md-6 mb-2">
                  <label htmlFor="userRole">Role</label>
                  <select
                    className="form-control"
                    ref={userRole}
                    name="role"
                    required
                    id="userRole"
                  >
                    <option value="" checked>
                      Selecciona un rol
                    </option>
                    <option value="admin">administrador</option>
                    <option value="owner">Dueño</option>
                    <option value="worker">empleado</option>
                  </select>
                </div>

                <div className="form-group col-md-6 mb-2">
                  <label htmlFor="">Genero</label>
                  <div className="form-check mb-3">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="flexRadioDefault"
                      id="flexRadioDefault1"
                      value="M"
                      onChange={handleChangeGender}
                    />
                    <label
                      className="form-check-label"
                      htmlFor="flexRadioDefault1"
                    >
                      Masculino
                    </label>
                  </div>
                  <div className="form-check mb-3">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="flexRadioDefault"
                      id="flexRadioDefault2"
                      value="F"
                      checked
                      onChange={handleChangeGender}
                    />
                    <label
                      className="form-check-label"
                      htmlFor="flexRadioDefault2"
                    >
                      Femenino
                    </label>
                  </div>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="flexRadioDefault"
                      id="flexRadioDefault3"
                      value="O"
                      onChange={handleChangeGender}
                    />
                    <label
                      className="form-check-label"
                      htmlFor="flexRadioDefault3"
                    >
                      Otros
                    </label>
                  </div>
                </div>

                <div className="form-group col-md-6 mb-2">
                  <label htmlFor="userPassword">Contraseña</label>
                  <input
                    className="form-control"
                    type="password"
                    ref={userPassword}
                    name="password"
                    id="userPassword"
                    required
                  />
                </div>
                <input
                  type="submit"
                  className="btn btn-primary"
                  value="Crear"
                />
              </form>
            </Col>
          </Row>
        </div>
      </div>

      {/* MODLA UPDATE USER */}

      <Modal show={showUpdateModal} onHide={closeUpdateModal}>
        <Modal.Header closeButton>
          <Modal.Title>Actualizar empleado</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleUpdateUser}>
            <div className="row">
              {user && (
                <>
                  <div className="form-group mb-2">
                    <label htmlFor="editUserEmail">Email</label>
                    <input
                      type="email"
                      id="editUserEmail"
                      className="form-control"
                      defaultValue={user.email}
                      ref={updateEmail}
                      required
                    />
                  </div>

                  <div className="form-group mb-2">
                    <label htmlFor="editUserName">Nombre: </label>
                    <input
                      type="text"
                      id="editUserName"
                      className="form-control"
                      defaultValue={user.name}
                      ref={updateName}
                      required
                    />
                  </div>

                  <div className="form-group mb-2">
                    <label htmlFor="editUserLastname">Apellido: </label>
                    <input
                      type="text"
                      id="editUserLastname"
                      className="form-control"
                      defaultValue={user.lastname}
                      ref={updateLastname}
                      required
                    />
                  </div>

                  <div className="form-group mb-2">
                    <label htmlFor="editUserRole">Role: </label>
                    {user && (
                      <select
                        name="role"
                        className="form-control"
                        id="editUserRole"
                        ref={updateRole}
                        required
                      >
                        <option value="">Selecciona un rol</option>
                        <option value="worker">Empleado</option>
                        <option value="owner">Dueño</option>
                        <option value="admin">Admnistrador</option>
                      </select>
                    )}
                  </div>

                  <div className="form-group mb-2">
                    <label htmlFor="editUserPassword">
                      Contraseña <small>(opcional)</small>:{" "}
                    </label>
                    <input
                      type="text"
                      id="editUserPassword"
                      className="form-control"
                      ref={updatePassword}
                    />
                  </div>
                </>
              )}
            </div>
            <Modal.Footer>
              <Button variant="secondary" onClick={closeUpdateModal}>
                cancelar
              </Button>
              <input
                type="submit"
                className="btn btn-primary"
                value={"Actualizar"}
              />
            </Modal.Footer>
          </form>
        </Modal.Body>
      </Modal>

      {/* MODAL DELETE USER */}

      <Modal show={showDeleteModal} onHide={closeDeleteModal}>
        <Modal.Header closeButton>
          <Modal.Title></Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={hanndleDeleteUser}>
            <div className="row">
              <h5>¿Seguro que desea eliminar este usuario?</h5>
            </div>
            <Modal.Footer>
              <Button variant="secondary" onClick={closeDeleteModal}>
                cancelar
              </Button>
              <input
                type="submit"
                className="btn btn-danger"
                value={"Eliminar"}
              />
            </Modal.Footer>
          </form>
        </Modal.Body>
      </Modal>
    </FullLayout>
  );
}
