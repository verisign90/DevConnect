import React from "react";
import { useTracker } from "meteor/react-meteor-data";
import { useNavigate } from "react-router-dom";
import { Meteor } from "meteor/meteor";
import { StudyUsers } from "/imports/api/collections.js";

//내 프로필
const MyProfile = () => {
  const navigate = useNavigate();

  const { user, isReady } = useTracker(() => {
    const user = Meteor.user();
    const isReady = Meteor.subscribe("allUserEmails").ready();

    return {
      user: user,
      isReady: isReady,
    };
  });

  if (!isReady) {
    return <div>로딩 중...</div>;
  }

  //프로필 편집
  const goEditProfile = (userId) => {
    navigate(`/editProfile/${userId}`);
  };

  return (
    <>
      <h2>내 프로필</h2>
      {user.profile.image && (
        <img
          src={user.profile.image}
          style={{ width: "150px", height: "150px", borderRadius: "50%" }}
        />
      )}
      {user.username} {user.emails[0].address}
      <button onClick={() => goEditProfile(user._id)}>프로필 편집</button>
      <hr />
      <h3>기술스택</h3>
      {user.profile.techStack.join(" ")}
      <hr />
      <h3>프로젝트 참여 이력</h3>
      <hr />
      <h3>점수</h3>
      <hr />
    </>
  );
};

export default MyProfile;
