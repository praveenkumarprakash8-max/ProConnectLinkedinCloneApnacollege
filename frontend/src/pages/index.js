import { useRouter } from "next/router";
import styles from "../styles/style.module.css";
import UserLayout from "../layout/UserLayout";

export default function Home() {
  const router = useRouter();

  return (
    <UserLayout>
      <div className={styles.container}>
        <div className={styles.mainContainer}>
          {/* Left Section */}
          <div className={styles.mainContainer_left}>
            <p>Connect with Friends without Exaggeration</p>
            <p>A true social media platform, with stories no blufs !</p>

            <div
              onClick={() => {
                router.push("/login");
              }}
              className={styles.buttonJoin}
            >
              <p>Join Now</p>
            </div>
          </div>

          {/* Right Section (Bahar hona chahiye) */}
          <div className={styles.mainContainer_right}>
            <img src="/images/connection.jpg" alt="connection" />
          </div>
        </div>
      </div>
    </UserLayout>
  );
}
