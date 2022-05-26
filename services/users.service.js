import axios from "axios";

export const getUserByEmail = (data, token) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };

  return axios.post(
    `${process.env.NEXT_PUBLIC_API_HOST}/users/email`,
    data,
    config
  );
};

export const createUser = (data, token) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };

  return axios.post(`${process.env.NEXT_PUBLIC_API_HOST}/users`, data, config);
};

export const deleteUser = (id, token) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };

  return axios.delete(
    `${process.env.NEXT_PUBLIC_API_HOST}/users/${id}`,
    config
  );
};
