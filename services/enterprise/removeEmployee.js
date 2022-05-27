import axios from "axios";

export default (data, token) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };

  return axios.put(
    `${process.env.NEXT_PUBLIC_API_HOST}/enterprises/remove/employee`,
    data,
    config
  );
};
