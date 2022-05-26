import { useState, useEffect } from "react";
import localforage from "localforage";
import authInitialState from "../initialStates/authInitialState";

const useAuthState = () => {
  const [state, setState] = useState(authInitialState);

  useEffect(() => {
    localforage
      .getItem("userAuthData")
      .then((value) => {
        setState(JSON.parse(value));
      })
      .catch((err) => {
        console.log("error getting localstorage");
      });
  }, []);

  const login = (payload) => {
    localforage
      .setItem("userAuthData", JSON.stringify(payload))
      .catch(function (err) {
        // This code runs if there were any errors
        console.log(err);
      });

    setState({
      ...state,
      ...payload,
    });
  };

  const loggoutAuth = () => {
    localforage
      .setItem("userAuthData", JSON.stringify([]))
      .catch(function (err) {
        // This code runs if there were any errors
        console.log(err);
      });

    setState(authInitialState);
  };

  return {
    login,
    authState: state,
    loggoutAuth,
  };
};

export default useAuthState;
