import axios from "axios";

export default (id, token) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };

  return axios.delete(
    `${process.env.NEXT_PUBLIC_API_HOST}/groups/${id}`,
    config
  );
};
