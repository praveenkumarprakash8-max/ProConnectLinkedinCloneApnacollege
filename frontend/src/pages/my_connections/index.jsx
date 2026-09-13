import React, { useEffect } from "react";
import UserLayout from "../../layout/UserLayout";
import DashboardLayout from "../../layout/DashboardLayout";
import { useDispatch, useSelector } from "react-redux";
import { getMyConnectionRequest } from "../../config/redux/action/authAction";
import styles from "./index.module.css";
import { BASE_URL } from "../../config";
import { useRouter } from "next/router";
import { acceptConnection } from "../../config/redux/action/authAction";
export default function MyConnections() {
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);
  const router = useRouter();

  useEffect(() => {
    dispatch(getMyConnectionRequest({ token: localStorage.getItem("token") }));
  }, []);

  useEffect(() => {
    if (authState.connectionRequest.length != 0) {
      console.log(authState.connectionRequest);
    }
  }, [authState.connectionRequest]);

  return (
    <UserLayout>
      <DashboardLayout>
        <div
          style={{ display: "flex", flexDirection: "column", gap: "1.7rem" }}
        >
          <h3>My connections</h3>

          {authState.connectionRequest.length === 0 && (
            <h1>No Connection Request Pending</h1>
          )}

          {/* 1. Pending Requests (status_accepted === null) with Accept Button */}
          {authState.connectionRequest.length != 0 &&
            authState.connectionRequest
              .filter((connection) => connection.status_accepted === null)
              .map((user, index) => {
                return (
                  <div
                    onClick={() => {
                      router.push(`/view_profile/${user.userId.username}`);
                    }}
                    className={styles.userCard}
                    key={index}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "1.2rem",
                        justifyContent: "space-between",
                      }}
                    >
                      <div className={styles.profilePicture}>
                        <img
                          src={`${BASE_URL}/${user.userId.profilePicture}`}
                          alt=""
                        />
                      </div>
                      <div className={styles.userInfo}>
                        <h1>{user.userId.name}</h1>
                        <p>{user.userId.username}</p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          dispatch(
                            acceptConnection({
                              connectionId: user._id,
                              token: localStorage.getItem("token"),
                              action: "accepted",
                            }),
                          );
                        }}
                        className={styles.connectedButton}
                      >
                        Accept
                      </button>
                    </div>
                  </div>
                );
              })}

          <h3>My Networks</h3>
          {authState.connectionRequest.length != 0 &&
            authState.connectionRequest
              .filter((connection) => connection.status_accepted !== null)
              .map((user, index) => {
                return (
                  <div
                    onClick={() => {
                      router.push(`/view_profile/${user.userId.username}`);
                    }}
                    className={styles.userCard}
                    key={index}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "1.2rem",
                        justifyContent: "space-between",
                      }}
                    >
                      <div className={styles.profilePicture}>
                        <img
                          src={`${BASE_URL}/${user.userId.profilePicture}`}
                          alt=""
                        />
                      </div>
                      <div className={styles.userInfo}>
                        <h1>{user.userId.name}</h1>
                        <p>{user.userId.username}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
        </div>
      </DashboardLayout>
    </UserLayout>
  );
}
