import React from "react";

import AdminLayout from "../../components/admin/AdminLayout";

import styles from "../../styles/admin/admin.module.css";

import CreateUserModal from "../../components/admin/components/CreateUserModal";

const adminUsers = () => {
  return (
    <>
      <AdminLayout>
        <div className="container">
          <div className={`pt-5 pb-3 ${styles.page_title_container}`}>
            <h1 className={styles.page__title}>Usuarios</h1>
            <div>
              <button
                className="btn btn-primary"
                data-bs-toggle="modal"
                data-bs-target="#createUser"
              >
                Crear usuario
              </button>
            </div>
          </div>
          <table class="table table-striped">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">First</th>
                <th scope="col">Last</th>
                <th scope="col">Handle</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">1</th>
                <td>Mark</td>
                <td>Otto</td>
                <td>@mdo</td>
              </tr>
              <tr>
                <th scope="row">2</th>
                <td>Jacob</td>
                <td>Thornton</td>
                <td>@fat</td>
              </tr>
            </tbody>
          </table>
        </div>
      </AdminLayout>
      <CreateUserModal />
    </>
  );
};

export default adminUsers;
