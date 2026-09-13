import React, { useEffect } from "react";
import UserLayout from "../../layout/UserLayout";
import DashboardLayout from "../../layout/DashboardLayout";
import { useDispatch, useSelector } from "react-redux";
import { getAllUsers } from "../../config/redux/action/authAction";
import { BASE_URL } from "../../config";
import { useRouter } from "next/router";
import styles from "./discover.module.css";

export default function DiscoverPage() {
  const authState = useSelector((state) => state.auth);

  const dispath = useDispatch();
  const router = useRouter();

  useEffect(() => {
    if (!authState.all_profiles_fetch) {
      dispath(getAllUsers());
    }
  });

  return (
    <UserLayout>
      <DashboardLayout>
        <div>
          <h1>Discover</h1>

          <div className={styles.allUserProfiles}>
            {authState.all_profiles_fetch &&
              authState.all_users.map((user) => {
                return (
                  <div
                    key={user._id}
                    onClick={() =>
                      router.push(`/view_profile/${user.userid.username}`)
                    }
                    className={styles.userCard}
                  >
                    <img
                      className={styles.userCard_image}
                      src={`${BASE_URL}/${user.userid.profilePicture}`}
                      alt="profile"
                    />
                    <div>
                      <h2>{user.userid.name}</h2>
                      <p>@{user.userid.username}</p>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </DashboardLayout>
    </UserLayout>
  );
}
