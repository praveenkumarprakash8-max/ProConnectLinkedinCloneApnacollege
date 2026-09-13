import React, { useEffect, useState } from "react";
import UserLayout from "../../layout/UserLayout";
import DashboardLayout from "../../layout/DashboardLayout";
import { useDispatch, useSelector } from "react-redux";
import { getAboutUser } from "../../config/redux/action/authAction";
import styles from "./index.module.css";
import clientServer, { BASE_URL } from "../../config";
import { useRouter } from "next/router";
import { getAllPosts } from "../../config/redux/action/postAction";
import { resetPostId } from "../../config/redux/reducer/postReducer";

export default function ProfilePage() {
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);
  const [userProfile, setUserProfile] = useState({});
  const [userPosts, setUserPosts] = useState([]);
  const postReducer = useSelector((state) => state.postReducer);
  const postState = useSelector((state) => state.postReducer);
  const [ismodalOpen, setIsModalOpen] = useState(false);
  const [isEducationModalOpen, setIsEducationModalOpen] = useState(false);
  const [inputData, setInputData] = useState({
    company: "",
    position: "",
    years: "",
  });
  const handleWorkInputChange = (e) => {
    const { name, value } = e.target;
    setInputData({ ...inputData, [name]: value });
  };

  const [inputEducation, setInputEducation] = useState({
    school: "",
    degree: "",
    fieldOfStudy: "",
  });

  const handleEducationInputChange = (e) => {
    const { name, value } = e.target;
    setInputEducation({ ...inputEducation, [name]: value });
  };

  //   const router = useRouter();

  useEffect(() => {
    dispatch(getAboutUser({ token: localStorage.getItem("token") }));
    dispatch(getAllPosts());
  }, []);

  useEffect(() => {
    if (authState.user != undefined) {
      setUserProfile(authState.user);
      let post = postReducer.posts.filter((post) => {
        return post.userid.username === authState.user.userid.username;
      });
      console.log(post, authState.user.userid.username);
      setUserPosts(post);
    }
  }, [authState.user, postReducer?.posts]);

  const updateProfilePicture = async (file) => {
    const formData = new FormData();
    formData.append("profile_picture", file);
    formData.append("token", localStorage.getItem("token"));

    const response = await clientServer.post(
      "/update_profile_picture",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
    dispatch(getAboutUser({ token: localStorage.getItem("token") }));
  };

  const updateProfileData = async () => {
    const request = await clientServer.post("/user_update", {
      token: localStorage.getItem("token"),
      name: userProfile.userid.name,
    });

    const response = await clientServer.post("/update_profile_data", {
      token: localStorage.getItem("token"),
      bio: userProfile.bio,
      currentPost: userProfile.currentPost,
      pastWork: userProfile.pastWork,
      education: userProfile.education,
    });
    dispatch(getAboutUser({ token: localStorage.getItem("token") }));
  };

  return (
    <UserLayout>
      <DashboardLayout>
        {authState.user && userProfile.userid && (
          <div className={styles.container}>
            <div className={styles.backDropContainer}>
              <label
                htmlFor="profilePictureUpload"
                className={styles.backDrop_overlay}
              >
                <p>Edit</p>
              </label>
              <input
                onChange={(e) => {
                  updateProfilePicture(e.target.files[0]);
                }}
                hidden
                type="file"
                id="profilePictureUpload"
              ></input>
              <img
                src={`${BASE_URL}/${userProfile.userid.profilePicture}`}
                alt="backdrop"
              ></img>
            </div>

            <div className={styles.profileContainer_details}>
              <div style={{ display: "flex", gap: "0.7rem" }}>
                <div style={{ flex: "0.8" }}>
                  <div
                    style={{
                      display: "flex",
                      width: "fit-content",
                      alignItems: "center",
                      gap: "1.2rem",
                    }}
                  >
                    <input
                      className={styles.nameEdit}
                      type="text"
                      value={userProfile.userid.name}
                      onChange={(e) => {
                        setUserProfile({
                          ...userProfile,
                          userid: {
                            ...userProfile.userid,
                            name: e.target.value,
                          },
                        });
                      }}
                    ></input>
                    <p style={{ color: "grey" }}>
                      @{userProfile.userid.username}
                    </p>
                  </div>

                  <div>
                    <textarea
                      placeholder="Enter your bio..."
                      value={userProfile.bio}
                      onChange={(e) => {
                        setUserProfile({ ...userProfile, bio: e.target.value });
                      }}
                      rows={Math.max(
                        2,
                        Math.ceil((userProfile.bio?.length || 0) / 80),
                      )}
                      style={{
                        width: "100%",
                      }}
                    />
                  </div>
                </div>

                <div style={{ flex: "0.2" }}>
                  <h3>Recent Activity</h3>
                  {userPosts.map((post) => {
                    return (
                      <div key={post._id} className={styles.postCard}>
                        <div className={styles.card}>
                          <div className={styles.card_profileContainer}>
                            {post.media !== "" ? (
                              <img
                                src={`${BASE_URL}/${post.media}`}
                                alt=""
                              ></img>
                            ) : (
                              <div
                                style={{ width: "3.4rem", height: "3.4rem" }}
                              ></div>
                            )}
                          </div>
                          <p>{post.body}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="workHistory">
              <h4>Work History</h4>

              <div className={styles.workHistoryContainer}>
                {userProfile.pastWork?.map((work, index) => {
                  return (
                    <div key={index} className={styles.workHistoryCard}>
                      <p
                        style={{
                          fontWeight: "bold",
                          display: "flex",
                          alignItems: "center",
                          gap: "0.8rem",
                        }}
                      >
                        {work.company} - {work.position}
                      </p>
                      <p>{work.years}</p>
                    </div>
                  );
                })}

                <button
                  className={styles.addWorkButton}
                  onClick={() => {
                    setIsModalOpen(true);
                  }}
                >
                  Add Work
                </button>
              </div>
            </div>

            <div className="workHistory">
              <h4>Education</h4>

              <div className={styles.workHistoryContainer}>
                {userProfile.education?.map((edu, index) => {
                  return (
                    <div key={index} className={styles.workHistoryCard}>
                      <p
                        style={{
                          fontWeight: "bold",
                          display: "flex",
                          alignItems: "center",
                          gap: "0.8rem",
                        }}
                      >
                        {edu.school} - {edu.degree}
                      </p>
                      <p>{edu.fieldOfStudy}</p>
                    </div>
                  );
                })}

                <button
                  className={styles.addWorkButton}
                  onClick={() => {
                    setIsEducationModalOpen(true);
                  }}
                >
                  Add Education
                </button>
              </div>
            </div>
          </div>
        )}
        {userProfile != authState.user && (
          <div
            onClick={() => {
              updateProfileData();
            }}
            className={styles.updateProfileBtn}
          >
            Update Profile
          </div>
        )}

        {ismodalOpen && (
          <div
            onClick={() => {
              setIsModalOpen(false);
            }}
            className={styles.commentContainer}
          >
            <div
              onClick={(e) => {
                e.stopPropagation();
              }}
              className={styles.allCommentsContainer}
            >
              <input
                onChange={handleWorkInputChange}
                name="company"
                className={styles.inputField}
                type="text"
                placeholder="Enter Company"
              ></input>
              <input
                onChange={handleWorkInputChange}
                name="position"
                className={styles.inputField}
                type="text"
                placeholder="Enter Position"
              ></input>
              <input
                onChange={handleWorkInputChange}
                name="years"
                className={styles.inputField}
                type="number"
                placeholder="Years"
              ></input>

              <div
                onClick={() => {
                  setUserProfile({
                    ...userProfile,
                    pastWork: [...userProfile.pastWork, inputData],
                  });
                  setIsModalOpen(false);
                }}
                className={styles.updateProfileBtn}
              >
                Add Work
              </div>
            </div>
          </div>
        )}

        {isEducationModalOpen && (
          <div
            onClick={() => {
              setIsEducationModalOpen(false);
            }}
            className={styles.commentContainer}
          >
            <div
              onClick={(e) => {
                e.stopPropagation();
              }}
              className={styles.allCommentsContainer}
            >
              <input
                onChange={handleEducationInputChange}
                name="school"
                className={styles.inputField}
                type="text"
                placeholder="Enter School / College"
              />
              <input
                onChange={handleEducationInputChange}
                name="degree"
                className={styles.inputField}
                type="text"
                placeholder="Enter Degree"
              />
              <input
                onChange={handleEducationInputChange}
                name="fieldOfStudy"
                className={styles.inputField}
                type="text"
                placeholder="Field of Study"
              />

              <div
                onClick={() => {
                  setUserProfile({
                    ...userProfile,
                    education: [...userProfile.education, inputEducation],
                  });
                  setIsEducationModalOpen(false);
                }}
                className={styles.updateProfileBtn}
              >
                Add Education
              </div>
            </div>
          </div>
        )}
      </DashboardLayout>
    </UserLayout>
  );
}
