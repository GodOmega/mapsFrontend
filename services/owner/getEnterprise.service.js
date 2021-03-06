import axios from "axios";

export default (token, id) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  return axios.get(
    `${process.env.NEXT_PUBLIC_API_HOST}/enterprises/${id}`,
    config
  );
};
