import axios from "axios";

export default async (token, id) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  if (id && token) {
    const { data } = await axios.get(
      `${process.env.NEXT_PUBLIC_API_HOST}/groups/${id}`,
      config
    );
    return data;
  }
};
