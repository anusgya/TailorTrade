"use client";
import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
function AuthChecker({ children }) {
  const { user } = useAuth();
  const user_id = user?._id;

  useEffect(() => {
    if (user_id) {
      fetch(`http://localhost:8080/api/auth/${user_id}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.user.user_role === "seamster") router.push("/seamster/home");
          else {
            router.push("/customer/home");
          }
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [user_id]);
  return <>{children}</>;
}

export default AuthChecker;
