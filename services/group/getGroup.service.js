import axios from "axios";

export default async (token, id) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  if (id && token) {
    const { data } = await axios.get(
      `${process.env.API_HOST}/enterprises/groups/${id}`,
      config
    );
    return data;
  }
};
