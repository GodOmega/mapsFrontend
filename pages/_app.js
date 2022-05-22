import { AuthContextProvider } from "../stores/authContext";
import { UserLoggedContextProvider } from "../stores/userLoggedContext";
import "../styles/globalStyles.css";
import "../styles/normalize.css";

// This default export is required in a new `pages/_app.js` file.
export default function MyApp({ Component, pageProps }) {
  return (
    <AuthContextProvider>
      <UserLoggedContextProvider>
        <Component {...pageProps} />
      </UserLoggedContextProvider>
    </AuthContextProvider>
  );
}
