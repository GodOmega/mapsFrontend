import Head from "next/head";
import { useRef, useState, useContext, useEffect } from "react";
import { useRouter } from "next/router";
import { Col, Row, Table } from "reactstrap";
import { Modal, Button } from "react-bootstrap";

import FullLayout from "../../components/admin/layouts/FullLayout";
import getSpecificEnterprises from "../../services/enterprise/getSpecificEnterprises";

import { AuthContext } from "../../stores/authContext";
import { UserLoggedContext } from "../../stores/userLoggedContext";
import deleteEnterprise from "../../services/enterprise/deleteEnterprise";
import { getUserByEmail } from "../../services/users.service";
import createEnterprise from "../../services/enterprise/createEnterprise";

export default function AdminEnterprises() {
  const [enterprises, setEnterprises] = useState(null);
  const [enterprise, setEnterprise] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // user state
  const [user, setUser] = useState(null);
  const [userErrMsg, setUserErrMsg] = useState(null);

  const {
    authState: { acces_token, role },
    loggoutAuth,
  } = useContext(AuthContext);

  const { userLoggout } = useContext(UserLoggedContext);

  const router = useRouter();

  // REFS

  const enterpriseName = useRef(null);

  // create enterprise
  const userSearch = useRef(null);
  const createEnterpriseName = useRef(null);

  const openDeleteModal = () => setShowDeleteModal(true);
  const closeDeleteModal = () => setShowDeleteModal(false);

  const handleGetEnterprises = async (e) => {
    e.preventDefault();

    const name = enterpriseName.current.value;

    try {
      const { data } = await getSpecificEnterprises(name, acces_token);
      setEnterprises(data);
      e.target.reset();
    } catch (error) {
      const { response } = error;
      if (response.status === 401) {
        loggoutAuth();
        userLoggout();
        router.push("/login");
      }
      alert("Ocurio un error");
    }
  };

  const handleClickModal = (enterprise) => {
    setEnterprise(enterprise);
    openDeleteModal();
  };

  const handleDeleteEnterprise = async (e) => {
    e.preventDefault();

    if (enterprise) {
      try {
        const { data } = await deleteEnterprise(enterprise.id, acces_token);
        alert(`Empresa ${enterprise.name} eliminada`);
        setShowDeleteModal(false);
        setEnterprises(null);
        setEnterprise(null);
      } catch (error) {
        if (response.status === 401) {
          loggoutAuth();
          userLoggout();
          router.puesh("/login");
        }
        alert("Ha ocurrido un error");
      }
    }
  };

  // USER AND CREATE ENTERPRISE

  const handleGetUser = async (e) => {
    e.preventDefault();
    try {
      const userData = {
        email: userSearch.current.value,
      };
      const { data } = await getUserByEmail(userData, acces_token);
      setUser(data);
      setUserErrMsg(null);
    } catch (error) {
      const { response } = error;

      if (response.status === 404) {
        setUser(null);
        setUserErrMsg(true);
      }

      if (response.status === 401) {
        loggoutAuth();
        userLoggout();
        router.push("/login");
      }

      alert("Ha ocurrido un error");
    }
  };

  const handleCreateEnterprise = async (e) => {
    e.preventDefault();
    if (user) {
      try {
        const enterpriseData = {
          name: createEnterpriseName.current.value,
          userId: user.id,
        };
        const { data } = await createEnterprise(enterpriseData, acces_token);
        setUser(null);
        e.target.reset();
        alert("Empresa creada con exito");
        userSearch.current.value = "";
      } catch (error) {
        const { response } = error;
        if (response.status === 401) {
          loggoutAuth();
          userLoggout();
          router.puesh("/login");
        }
        alert("Ha ocurrido un error");
      }
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
          <title>Admin panel | Empresas</title>
          <meta
            name="description"
            content="Ample Admin Next Js Free Aadmin Dashboard"
          />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <div>
          <Row className="mb-5">
            <Col sm="6" lg="3">
              <h1>Empresas</h1>
            </Col>
          </Row>
          <Row className="mb-3">
            <Col sm="6" lg="3">
              <h5>Buscar empresa</h5>
            </Col>
            <Col sm="12" lg="6">
              <form onSubmit={handleGetEnterprises}>
                <div className="form-group mb-2">
                  <label className="mb-2" htmlFor="enterpriseName">
                    Nombre de la empresa
                  </label>
                  <input
                    type="text"
                    name="name"
                    className="form-control"
                    id="enterpriseName"
                    autoComplete="off"
                    required
                    ref={enterpriseName}
                  />
                </div>
                <input
                  type="submit"
                  className="btn btn-primary"
                  value="Buscar"
                />
              </form>
            </Col>
          </Row>
          <Row className="mb-4">
            <Col sm="12">
              {enterprises && (
                <Table striped bordered hover size="sm">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email dueño</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {enterprises.length > 0 &&
                      enterprises.map(({ name, user, id }) => (
                        <tr key={id}>
                          <td className="text-center">{name}</td>
                          <td className="text-center">{user.email}</td>
                          <td>
                            <button
                              onClick={() => handleClickModal({ name, id })}
                              className="btn btn-sm btn-danger"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    {enterprises.length === 0 && (
                      <tr>
                        <td className="text-center" colSpan="4">
                          0 Empresas encontradas
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              )}
            </Col>
          </Row>

          {/* CREAR EMPRESA */}
          <Row>
            <Col sm="12" lg="6">
              <h5>Crear empresa</h5>
            </Col>
            <Col className="mb-3" sm="12" lg="6">
              <form onSubmit={handleGetUser}>
                <div className="form-group mb-2">
                  {userErrMsg && (
                    <div className="alert alert-danger">
                      Usuario no encontrado
                    </div>
                  )}
                  <label className="mb-2" htmlFor="emailUser">
                    Escoger dueño
                  </label>
                  <input
                    type="email"
                    autoComplete="off"
                    className="form-control"
                    placeholder="user@email.com"
                    name="email"
                    id="emailUser"
                    required
                    ref={userSearch}
                  />
                </div>
                <input
                  className="btn btn-primary"
                  type="submit"
                  value="Buscar"
                />
              </form>
            </Col>
            {user && (
              <Col sm="12">
                <form onSubmit={handleCreateEnterprise}>
                  <div className="form-group mb-2">
                    <label className="mb-2" htmlFor="enterpriseName">
                      Nombre de la empresa
                    </label>
                    <input
                      className="form-control"
                      type="text"
                      name="name"
                      id="enterpriseName"
                      ref={createEnterpriseName}
                    />
                  </div>
                  <input
                    type="submit"
                    className="btn btn-primary"
                    value="Crear empresa"
                  />
                </form>
              </Col>
            )}
          </Row>
        </div>
      </div>
      <Modal show={showDeleteModal} onHide={closeDeleteModal}>
        <Modal.Header closeButton>
          <Modal.Title></Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleDeleteEnterprise}>
            <div className="row">
              <h5>
                ¿Seguro que desea eliminar la empresa: {enterprise?.name}?
              </h5>
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
