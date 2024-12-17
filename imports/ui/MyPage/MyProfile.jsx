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
  <div className="max-w-6xl mx-auto px-6 py-12 bg-white">
    {/* 프로필 제목 */}
    <h2 className="text-2xl font-bold mb-6 text-gray-900">내 프로필</h2>

    {/* 프로필 이미지와 사용자 정보 */}
    <div className="flex items-center gap-6 mb-8">
      {user.profile.image && (
        <img
          src={user.profile.image}
          alt="프로필 이미지"
          className="w-36 h-36 rounded-full object-cover border-2 border-gray-200"
        />
      )}
      <div>
        <p className="text-lg font-semibold text-gray-900">{user.username}</p>
        <p className="text-gray-600">{user.emails[0].address}</p>
        {isMyProfile && (
          <button
            onClick={() => goEditProfile(user._id)}
            className="mt-4 inline-block bg-indigo-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-600"
          >
            프로필 편집
          </button>
        )}
      </div>
    </div>

    <hr className="my-8 border-t border-gray-300" />

    {/* 기술스택 */}
    <div className="mb-8">
      <h3 className="text-xl font-semibold mb-4 text-gray-900">기술스택</h3>
      <div className="flex flex-wrap gap-2">
        {user.profile.techStack.length > 0 ? (
          user.profile.techStack.map((stack) => (
            <span
              key={stack}
              className="inline-block bg-indigo-100 text-indigo-800 font-medium px-3 py-1 rounded-full"
            >
              {stack}
            </span>
          ))
        ) : (
          <p className="text-gray-500">기술스택이 없습니다.</p>
        )}
      </div>
    </div>

    <hr className="my-8 border-t border-gray-300" />

    {/* 프로젝트 참여 이력 */}
    <div className="mb-8">
      <h3 className="text-xl font-semibold mb-4 text-gray-900">프로젝트 참여 이력</h3>
      {joinList.length > 0 ? (
        <ul className="space-y-4">
          {joinList.map((study) => {
            const okCount = StudyUsers.find({
              studyId: study._id,
              status: "승인",
            }).count();

            return (
              <li key={study._id} className="border-b pb-4">
                <Link
                  to={`/detail/${study._id}`}
                  className="text-indigo-600 font-medium hover:underline"
                >
                  {study.title} ({okCount}/{study.memberCount}){" "}
                  {study.status === "시작"
                    ? `시작 ${new Date(study.startDate).toStringYMD()}`
                    : `시작 ${new Date(study.startDate).toStringYMD()} 종료 ${new Date(study.endDate).toStringYMD()}`}
                  {" "}
                  <span className="text-gray-600">{study.techStack.join(", ")}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="text-gray-500">아직 참여한 프로젝트가 없습니다.</p>
      )}
    </div>

    {/* <hr className="my-8 border-t border-gray-300" /> */}

    {/* 점수 */}
    <div>
      <h3 className="text-xl font-semibold mb-4 text-gray-900">점수</h3>
      <ul className="space-y-2">
        {Object.entries(user.profile.score).map(([field, value]) => (
          <li key={field} className="flex justify-between text-gray-700">
            <span className="capitalize font-medium">{field}</span>
            <span className="font-semibold">{value.toFixed(1)}</span>
          </li>
        ))}
      </ul>
    </div>
  </div>
</>

  );
};

export default MyProfile;
