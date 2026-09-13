import React from "react";
import styles from "./navbar.module.css";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { reset } from "../../config/redux/reducer/authReducer";

export default function NavbarComponent() {
  const router = useRouter();

  const authState = useSelector((state) => state.auth);

  const dispath = useDispatch();
  return (
    <div className={styles.container}>
      <div className={styles.navBar}>
        <h1
          style={{ cursor: "pointer" }}
          onClick={() => {
            router.push("/");
          }}
        >
          Pro Connect
        </h1>
        <div className={styles.navBarOptionContainer}>
          {authState.profileFetched && (
            <div>
              <div style={{ display: "flex", gap: "1.2rem" }}>
                {/* <p>Hey, {authState.user?.userid?.name}</p> */}
                <p
                  onClick={() => {
                    router.push("/profile");
                  }}
                  style={{ fontWeight: "bold", cursor: "pointer" }}
                >
                  Profile
                </p>
                <p
                  onClick={() => {
                    localStorage.removeItem("token");
                    router.push("/login");
                    dispath(reset());
                  }}
                  style={{ fontWeight: "bold", cursor: "pointer" }}
                >
                  Logout
                </p>
              </div>
            </div>
          )}

          {!authState.profileFetched && (
            <div
              onClick={() => {
                router.push("/login");
              }}
              className={styles.buttonJoin}
            >
              <p>Be a part</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
