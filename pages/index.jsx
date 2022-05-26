import { useEffect, useContext } from "react";
import { useRouter } from "next/router";
import { AuthContext } from "../stores/authContext";
const index = () => {
  const { authState } = useContext(AuthContext);
  const router = useRouter();

  console.log(authState);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if(authState) {
        if (!authState.role) {
          router.push("/login");
        }
  
        if (authState.role == "owner") {
          router.push("/owner");
        }
  
        if (authState.role == "admin") {
          router.push("/admin/users");
        }
  
        if (authState.role == "worker") {
          router.push("/work");
        }
      }
      router.push('/login')
    }, 600);

    return () => {
      clearTimeout(timeout);
    };
  }, [authState]);

  return "";
};

export default index;
