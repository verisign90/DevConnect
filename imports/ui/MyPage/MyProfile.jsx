import React from "react";
import { useTracker } from "meteor/react-meteor-data";
import { useNavigate, useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { Meteor } from "meteor/meteor";
import { StudyUsers, Studys } from "/imports/api/collections.js";
import "/imports/lib/utils.js";

//내 프로필
const MyProfile = () => {
  const navigate = useNavigate();
  const { userId } = useParams();

  const { user, isReady, joinList } = useTracker(() => {
    const user = userId ? Meteor.users.findOne(userId) : Meteor.user();
    const isReady = Meteor.subscribe("allUserEmails").ready();

    //내가 참여 중인 프로젝트 목록 가져오기
    //1. StudyUsers 컬렉션에서 내가 승인된 문서 찾기
    const studyUsers = StudyUsers.find({
      userId: user._id,
      status: "승인",
    });
    //2. 승인된 studyUsers 컬렉션 문서에서 studyId 추출
    const studyIds = studyUsers.map((studyUser) => studyUser.studyId);
    //3. Study 컬렉션에서 status가 모집중이 아닌 모집글만 추출
    const joinList = Studys.find({
      _id: { $in: studyIds },
      status: { $nin: ["모집중"] },
    }).fetch();

    return {
      user: user,
      isReady: isReady,
      joinList: joinList,
    };
  });

  if (!user) {
    return <div>로딩 중...</div>;
  }

  if (!isReady) {
    return <div>로딩 중...</div>;
  }

  //프로필 편집
  const goEditProfile = (userId) => {
    navigate(`/editProfile/${userId}`);
  };

  //현재 로그인한 사용자라면
  const isMyProfile = user._id === Meteor.userId();

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
      {isMyProfile && (
        <button onClick={() => goEditProfile(user._id)}>프로필 편집</button>
      )}
      <hr />
      <h3>기술스택</h3>
      {user.profile.techStack.join(" ")}
      <hr />
      <h3>프로젝트 참여 이력</h3>
      {joinList.length > 0 ? (
        joinList.map((study) => {
          const okCount = StudyUsers.find({
            studyId: study._id,
            status: "승인",
          }).count();

          return (
            <li key={study._id}>
              <Link to={`/detail/${study._id}`}>
                {study.title} ({okCount}/{study.memberCount}){" "}
                {study.status === "시작"
                  ? `시작 ${new Date(study.startDate).toStringYMD()}`
                  : `시작 ${new Date(
                      study.startDate
                    ).toStringYMD()} 종료 ${new Date(
                      study.endDate
                    ).toStringYMD()}`}{" "}
                {study.techStack.join(" ")}
              </Link>
            </li>
          );
        })
      ) : (
        <p>아직 참여한 프로젝트가 없습니다</p>
      )}
      <hr />
      <h3>점수</h3>
      {Object.entries(user.profile.score).map(([field, value]) => (
        <li key={field}>
          {field} : {value.toFixed(1)}
        </li>
      ))}
      <hr />
    </>
  );
};

export default MyProfile;
