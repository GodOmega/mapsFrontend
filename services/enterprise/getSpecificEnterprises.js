import axios from "axios";

export default (query, token) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  return axios.get(
    `${process.env.NEXT_PUBLIC_API_HOST}/enterprises?name=${query}`,
    config
  );
};
