import { useContext, useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Modal, Button } from "react-bootstrap";

import { AuthContext } from "../../../stores/authContext";
import MainHeader from "../../../components/ui/MainHeader";

// Service
import getEnterpriseService from "../../../services/owner/getEnterprise.service";

import styles from "../../../styles/pages/onwer/enterprise.module.css";
import createGroupService from "../../../services/group/createGroup.service";

const Enterprise = () => {
  const [enterprise, setEnterprise] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const groupName = useRef("");
  const form = useRef();

  const router = useRouter();
  const {
    authState: { acces_token },
  } = useContext(AuthContext);

  const { id } = router.query;

  const handleOpenCreateModal = () => setShowCreateModal(true);
  const handleCloseCreateModal = () => setShowCreateModal(false);

  const handleGroupSubmit = async (e) => {
    e.preventDefault();
    const data = {
      name: groupName.current.value,
      enterpriseId: id,
    };

    try {
      await createGroupService(id, acces_token, data);
      handleCloseCreateModal();
      const groups = await getEnterpriseService(acces_token, id);
      setEnterprise(groups);
      alert('Grupo creado con éxito')
    } catch (error) {
      console.log(error);
      alert('Ocurrio un error')
    }
  };

  useEffect(() => {
    Promise.all([getEnterpriseService(acces_token, id)])
      .then(([enterprise]) => {
        setEnterprise(enterprise);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [id, acces_token]);

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
                  <button className={`main_button ${styles.button_primary}`}>
                    Ver empleados
                  </button>

                  <button className={`main_button ${styles.button_secondary}`}>
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
      </main>
    </>
  );
};

export default Enterprise;
