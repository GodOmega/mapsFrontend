import axios from "axios";

export default (id, token) => {
  return axios.get(
    `${process.env.NEXT_PUBLIC_API_HOST}/groups/${id}/employees`
  );
};
