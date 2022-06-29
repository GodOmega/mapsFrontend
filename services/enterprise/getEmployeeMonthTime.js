import axios from "axios";

export default (data, token) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };

  return axios.post(
    `${process.env.NEXT_PUBLIC_API_HOST}/employees/month`,
    data,
    config
  );
};