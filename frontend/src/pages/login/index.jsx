import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import styles from "./style.module.css";
import { loginUser, registerUser } from "../../config/redux/action/authAction";
import {
  emptyMessage,
  handleLoginUser,
} from "../../config/redux/reducer/authReducer";

export default function LoginComponent() {
  const [userLoginMethod, setUserLoginMethod] = useState(false);

  const [email, setEmailAddress] = useState();

  const [password, setPassword] = useState();

  const [username, setUsername] = useState();

  const [name, setName] = useState();
  const authState = useSelector((state) => state.auth);
  const router = useRouter();
  const dispatch = useDispatch();

  const handleRegister = () => {
    console.log("Registering");
    dispatch(
      registerUser({
        name,
        username,
        email,
        password,
      }),
    );
  };

  const handleLogin = () => {
    console.log("logged In");
    dispatch(loginUser({ email: email, password: password }));
  };

  useEffect(() => {
    if (authState.loggedIn) {
      router.push("/dashboard");
    }
  }, [authState.loggedIn]);

  useEffect(() => {
    if (localStorage.getItem("token")) {
      router.push("/dashboard");
    }
  }, [authState.loggedIn]);

  useEffect(() => {
    dispatch(emptyMessage());
  }, [userLoginMethod]);

  return (
    <div className={styles.container}>
      <div className={styles.cardContainer}>
        <div className={styles.cardContainer_left}>
          <p className={styles.cardLeft_heading}>
            {userLoginMethod ? "Sign In" : "Sign Up"}
          </p>
          <p style={{ color: authState.isError ? "red" : "green" }}>
            {" "}
            {typeof authState.message === "object"
              ? authState.message?.message
              : authState.message}
          </p>
          <div className={styles.inputContainer}>
            {!userLoginMethod && (
              <div className={styles.inputRow}>
                <input
                  onChange={(e) => setUsername(e.target.value)}
                  className={styles.inputField}
                  type="text"
                  placeholder="Username"
                ></input>
                <input
                  onChange={(e) => setName(e.target.value)}
                  className={styles.inputField}
                  type="text"
                  placeholder="Name"
                ></input>
              </div>
            )}

            <input
              onChange={(e) => setEmailAddress(e.target.value)}
              className={styles.inputField}
              type="text"
              placeholder="email"
            ></input>
            <input
              onChange={(e) => setPassword(e.target.value)}
              className={styles.inputField}
              type="text"
              placeholder="password"
            ></input>

            <div className={styles.buttonWithOutline}>
              <p
                onClick={() => {
                  if (userLoginMethod) {
                    handleLogin();
                  } else {
                    handleRegister();
                  }
                }}
              >
                {userLoginMethod ? "Sign In" : "Sign Up"}
              </p>
            </div>
          </div>
        </div>
        <div className={styles.cardContainer_right}>
          {userLoginMethod ? (
            <p>Don't Have an account ?</p>
          ) : (
            <p>Already have an account ?</p>
          )}
          <div className={styles.buttonWithOutline}>
            <p
              onClick={() => {
                setUserLoginMethod(!userLoginMethod);
              }}
              style={{ color: "black", textAlign: "center" }}
            >
              {userLoginMethod ? "Sign Up" : "Sign In"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
