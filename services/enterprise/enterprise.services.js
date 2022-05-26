import axios from "axios";
export const updateEnterprise = (id, token, data) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };

  return axios.put(
    `${process.env.NEXT_PUBLIC_API_HOST}/enterprises/${id}`,
    data,
    config
  );
};
