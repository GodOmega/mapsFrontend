import { useState, useEffect } from "react";
import localforage from "localforage";
import userInitialState from "../initialStates/userInitialState";

const useUserState = () => {
  const [state, setState] = useState(userInitialState);

  useEffect(() => {
    localforage
      .getItem("userData")
      .then((value) => {
        setState(JSON.parse(value));
      })
      .catch((err) => {
        console.log("error getting localstorage");
      });
  }, []);

  const userLogged = (payload) => {
    localforage
      .setItem("userData", JSON.stringify(payload))
      .catch(function (err) {
        // This code runs if there were any errors
        console.log(err);
      });

    setState({
      ...state,
      ...payload,
    });
  };

  const userLoggout = () => {
    localforage
      .setItem("userData", JSON.stringify([]))
      .catch(function (err) {
        // This code runs if there were any errors
        console.log(err);
      });
    setState(userInitialState);
  };

  return {
    userLogged,
    userState: state,
    userLoggout
  };
};

export default useUserState;
