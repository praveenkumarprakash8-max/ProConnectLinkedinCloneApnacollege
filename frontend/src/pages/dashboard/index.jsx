import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import {
  createPost,
  deletePost,
  getAllComments,
  getAllPosts,
  postComment,
} from "../../config/redux/action/postAction";
import {
  getAboutUser,
  getAllUsers,
} from "../../config/redux/action/authAction";
import UserLayout from "../../layout/UserLayout";
import DashboardLayout from "../../layout/DashboardLayout";
import styles from "./index.module.css";
import { incrementLike } from "../../config/redux/action/postAction";
import { BASE_URL } from "../../config";
import { resetPostId } from "../../config/redux/reducer/postReducer";

export default function Dashboard() {
  const router = useRouter();
  const authState = useSelector((state) => state.auth);
  const dispath = useDispatch();
  const postState = useSelector((state) => state.postReducer);

  useEffect(() => {
    dispath(getAllPosts());
    dispath(getAboutUser({ token: localStorage.getItem("token") }));
    dispath(getAllUsers());
  }, [authState.isTokenThere]);

  const [postContent, setPostContent] = useState("");
  const [fileContent, setFileContent] = useState();
  const [commentText, setCommentText] = useState("");

  const handleUpload = async () => {
    await dispath(createPost({ file: fileContent, body: postContent }));
    setFileContent(null);
    setPostContent("");
    dispath(getAllPosts());
  };

  if (authState.user) {
    return (
      <UserLayout>
        <DashboardLayout>
          <div className={styles.scrollComponent}>
            <div className={styles.wrapper}>
              <div className={styles.createPostContainer}>
                <img
                  className={styles.userProfile}
                  src={`${BASE_URL}/${authState.user.userid.profilePicture}`}
                />
                <textarea
                  onChange={(e) => setPostContent(e.target.value)}
                  value={postContent}
                  placeholder="What's in your mind ?"
                  name=""
                  id=""
                ></textarea>
                <label htmlFor="fileUpload">
                  <div
                    style={{
                      backgroundColor: "rgb(25, 91, 171)",
                      borderRadius: "50%",
                    }}
                    className={styles.Fab}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="size-6"
                      style={{
                        width: "28px",
                        height: "28px",
                        cursor: "pointer",
                        stroke: "#ffffff",
                      }}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 4.5v15m7.5-7.5h-15"
                      />
                    </svg>
                    <input
                      onChange={(e) => setFileContent(e.target.files[0])}
                      type="file"
                      hidden
                      id="fileUpload"
                    ></input>
                  </div>
                </label>
                {postContent.length > 0 && (
                  <div onClick={handleUpload} className={styles.uploadButton}>
                    Post
                  </div>
                )}
              </div>
              <div className={styles.postContainer}>
                {postState.posts.map((post) => {
                  return (
                    <div key={post._id} className={styles.singleCard}>
                      <div className={styles.singleCard_profileContainer}>
                        <img
                          className={styles.userProfile}
                          src={`${BASE_URL}/${post.userid?.profilePicture}`}
                          alt="Profile"
                        />
                        <div>
                          <div
                            style={{
                              display: "flex",
                              gap: "1rem",
                              justifyContent: "space-between",
                            }}
                          >
                            <p
                              style={{
                                fontWeight: "bold",
                              }}
                            >
                              {post.userid?.name}
                            </p>
                            {post.userid._id === authState.user.userid._id && (
                              <div
                                onClick={async () => {
                                  await dispath(
                                    deletePost({ post_id: post._id }),
                                  );
                                  await dispath(getAllPosts());
                                }}
                                style={{ cursor: "pointer" }}
                              >
                                <svg
                                  style={{
                                    height: "1.3em",
                                    color: "red",
                                  }}
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  strokeWidth={1.5}
                                  stroke="currentColor"
                                  className="size-6"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                                  />
                                </svg>
                              </div>
                            )}
                          </div>

                          <p style={{ color: "grey" }}>
                            @{post.userid.username}
                          </p>
                          <p style={{ paddingTop: "0.8rem" }}>{post.body}</p>
                          <div className={styles.singleCard_image}>
                            {post.media !== "" ? (
                              <img src={`${BASE_URL}/${post.media}`} />
                            ) : (
                              <></>
                            )}
                          </div>

                          <div className={styles.optionContainer}>
                            <div
                              onClick={async () => {
                                await dispath(
                                  incrementLike({ post_id: post._id }),
                                );
                                await dispath(getAllPosts());
                              }}
                              className={styles.singleOption_optionContainer}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                className="size-6"
                              >
                                <path d="M7.493 18.5c-.425 0-.82-.236-.975-.632A7.48 7.48 0 0 1 6 15.125c0-1.75.599-3.358 1.602-4.634.151-.192.373-.309.6-.397.473-.183.89-.514 1.212-.924a9.042 9.042 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V2.75A.75.75 0 0 1 15 2a2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H14.23c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23h-.777ZM2.331 10.727a11.969 11.969 0 0 0-.831 4.398 12 12 0 0 0 .52 3.507C2.28 19.482 3.105 20 3.994 20H4.9c.445 0 .72-.498.523-.898a8.963 8.963 0 0 1-.924-3.977c0-1.708.476-3.305 1.302-4.666.245-.403-.028-.959-.5-.959H4.25c-.832 0-1.612.453-1.918 1.227Z" />
                              </svg>

                              <p>{post.likes}</p>
                            </div>
                            <div
                              onClick={() => {
                                dispath(getAllComments({ post_id: post._id }));
                              }}
                              className={styles.singleOption_optionContainer}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                className="size-6"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M4.804 21.644A6.707 6.707 0 0 0 6 21.75a6.721 6.721 0 0 0 3.583-1.029c.774.182 1.584.279 2.417.279 5.322 0 9.75-3.97 9.75-9 0-5.03-4.428-9-9.75-9s-9.75 3.97-9.75 9c0 2.409 1.025 4.587 2.674 6.192.232.226.277.428.254.543a3.73 3.73 0 0 1-.814 1.686.75.75 0 0 0 .44 1.223ZM8.25 10.875a1.125 1.125 0 1 0 0 2.25 1.125 1.125 0 0 0 0-2.25ZM10.875 12a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0Zm4.875-1.125a1.125 1.125 0 1 0 0 2.25 1.125 1.125 0 0 0 0-2.25Z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </div>
                            <div
                              onClick={() => {
                                const text = encodeURIComponent(post.body);
                                const url =
                                  encodeURIComponent("apnacollege.in");
                                const twitterUrl = `https://heroicons.com/solid=${text}&url=${url}`;
                                window.open(twitterUrl, "_blank");
                              }}
                              className={styles.singleOption_optionContainer}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                className="size-6"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M15.75 4.5a3 3 0 1 1 .825 2.066l-8.421 4.679a3.002 3.002 0 0 1 0 1.51l8.421 4.679a3 3 0 1 1-.729 1.31l-8.421-4.678a3 3 0 1 1 0-4.132l8.421-4.679a3 3 0 0 1-.096-.755Z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {postState.postId !== "" && (
            <div
              onClick={() => {
                dispath(resetPostId());
              }}
              className={styles.commentContainer}
            >
              <div
                onClick={(e) => {
                  e.stopPropagation();
                }}
                className={styles.allCommentsContainer}
              >
                {postState.comment.length === 0 && <h1>No comments</h1>}

                {postState.comment.map((postComment, index) => {
                  return (
                    <div key={postComment._id} className={styles.singleComment}>
                      <div className={styles.singleComment_profileContainer}>
                        <img
                          className={styles.userProfile}
                          src={`${BASE_URL}/${postComment.userid?.profilePicture}`}
                        ></img>
                        <div>
                          <p style={{ fontWeight: "bold" }}>
                            {postComment.userid?.name}
                          </p>
                          <p style={{ color: "grey" }}>
                            @{postComment.userid?.username}
                          </p>
                        </div>
                      </div>
                      <p>{postComment.body}</p>
                    </div>
                  );
                })}

                <div className={styles.postCommentContainer}>
                  <input
                    type=""
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder=" comment"
                  />
                  <div
                    onClick={async () => {
                      await dispath(
                        postComment({
                          post_id: postState.postId,
                          body: commentText,
                        }),
                      );
                      setCommentText("");
                      await dispath(
                        getAllComments({ post_id: postState.postId }),
                      );
                    }}
                    className={styles.postCommentContainer_commentBtn}
                  >
                    <p>comment</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DashboardLayout>
      </UserLayout>
    );
  } else {
    return (
      <UserLayout>
        <DashboardLayout>
          <h1>Loading...</h1>
        </DashboardLayout>
      </UserLayout>
    );
  }
}
