
import { AuthContextProvider } from "../stores/authContext";
import { UserLoggedContextProvider } from "../stores/userLoggedContext";

import "bootstrap/dist/css/bootstrap.css";
import "../styles/globalStyles.css";
import "../styles/normalize.css";
import { useEffect } from "react";

// This default export is required in a new `pages/_app.js` file.
export default function MyApp({ Component, pageProps }) {
  useEffect(() => {
    typeof document !== undefined
      ? require("bootstrap/dist/js/bootstrap")
      : null;
  }, []);

  return (
    <AuthContextProvider>
      <UserLoggedContextProvider>
        <Component {...pageProps} />
      </UserLoggedContextProvider>
    </AuthContextProvider>
  );
}
