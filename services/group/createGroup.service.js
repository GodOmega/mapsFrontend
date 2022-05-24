import axios from "axios";

export default (id, token, data) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };

  return axios.post(
    `${process.env.NEXT_PUBLIC_API_HOST}/groups`,
    data,
    config
  );
};
