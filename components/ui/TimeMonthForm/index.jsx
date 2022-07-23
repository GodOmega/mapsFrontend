import { useState, useRef, useContext } from "react";
import { useRouter } from "next/router";
import { Table } from "react-bootstrap";


import { AuthContext } from "../../../stores/authContext";
import getEmployeeMonthTime from "../../../services/enterprise/getEmployeeMonthTime";
import { UserLoggedContext } from "../../../stores/userLoggedContext";

const TimeMonthForm = () => {
  const [getEmployeeWithTime, setGetEmployeeWithTime] = useState(null);
  const [getEmployeeMessage, setGetEmployeeMessage] = useState([]);

  const userEmail = useRef("");

  const router = useRouter();
  const {
    authState: { acces_token },
    loggoutAuth,
  } = useContext(AuthContext);

  const { userLoggout } = useContext(UserLoggedContext);

  const { id } = router.query;

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const getData = {
        enterpriseId: parseInt(id),
        email: userEmail.current.value,
      };
      setGetEmployeeWithTime(null);
      setGetEmployeeMessage([]);
      const { data } = await getEmployeeMonthTime(getData, acces_token);
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

  return (
    <>
      <h5>Busqueda por mes</h5>
      <form onSubmit={handleSubmit}>
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
                <th>Empleado</th>
                <th>Work time</th>
                <th>Lunch time</th>
              </tr>
            </thead>
            <tbody>
              {getEmployeeWithTime && (
                <tr>
                  <td>
                    {getEmployeeWithTime.name} {getEmployeeWithTime.lastname}
                  </td>
                  <td>{getEmployeeWithTime.workTime}</td>
                  <td>{getEmployeeWithTime.lunchTime}</td>
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
        <div className="form-group">
          <input
            type="submit"
            value="Buscar"
            className="btn btn-sm btn-primary"
          />
        </div>
      </form>
    </>
  );
};

export default TimeMonthForm;
