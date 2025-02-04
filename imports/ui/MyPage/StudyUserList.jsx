import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTracker } from "meteor/react-meteor-data";
import { Meteor } from "meteor/meteor";
import { StudyUsers, Studys } from "/imports/api/collections";

//신청자 목록 페이지
const StudyUserList = () => {
  const { id } = useParams(); //studyId
  const navigate = useNavigate();

  //대기, 거절인 사용자 / 로그인한 사용자 추적
  const { study, wait, no, user } = useTracker(() => {
    const user = Meteor.user();
    const study = Studys.findOne({ _id: id });

    const waitUsers = StudyUsers.find({ studyId: id, status: "대기" }).fetch();
    const noUsers = StudyUsers.find({ studyId: id, status: "거절" }).fetch();

    const wait = waitUsers.map((w) => Meteor.users.findOne(w.userId));
    const no = noUsers.map((n) => Meteor.users.findOne(n.userId));

    return {
      study: study,
      wait: wait,
      no: no,
      user: user,
    };
  });
  console.log("study: ", study);

  if (!study) {
    return <div>로딩 중...</div>;
  }

  //프로젝트 참여 인원을 초과하지 않게 status를 승인으로 update
  const statusOk = (userId) => {
    Meteor.call("statusOk", userId, id, (err) => {
      if (err) {
        alert(err.reason);
      } else {
        console.log("statusOk 성공");
      }
    });
  };

  //status를 거절로 바꾸기
  const statusNo = (userId) => {
    Meteor.call("statusNo", userId, id, (err) => {
      if (err) {
        console.error("statusNo 실패: ", err);
      } else {
        console.log("statusNo 성공: ", userId);
      }
    });
  };

  //다른 사용자의 프로필 보기
  const goProfile = (userId) => {
    navigate(`/myProfile/${userId}`);
  };

  return (
    <>
      <div className="max-w-6xl mx-auto px-6 py-12 bg-white">
        {/* 제목 */}
        <h2 className="text-2xl font-bold mb-6 text-gray-900">신청자 목록</h2>

        {/* 신청자 목록 */}
        {wait && wait.length > 0 ? (
          <ul className="space-y-4">
            {wait.map((w) => (
              <li
                key={w._id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg shadow-sm border border-gray-200"
              >
                <div className="flex items-center gap-4">
                  {/* 프로필 이미지 */}
                  {w.profile.image ? (
                    <img
                      src={w.profile.image}
                      alt="profile"
                      className="w-16 h-16 rounded-full object-cover border border-gray-300"
                    />
                  ) : (
                    <span className="inline-block size-16 overflow-hidden rounded-full bg-gray-100">
                      <svg
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        className="size-full text-gray-300"
                      >
                        <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    </span>
                  )}

                  {/* 신청자 이름 */}
                  <span className="text-lg font-semibold text-gray-800">
                    {w.username}
                  </span>
                </div>

                {/* 버튼 그룹 */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => goProfile(w._id)}
                    className="bg-blue-600 text-white py-1 px-3 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    프로필
                  </button>
                  <button
                    onClick={() => statusOk(w._id)}
                    className="bg-green-600 text-white py-1 px-3 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    승인
                  </button>
                  <button
                    onClick={() => statusNo(w._id)}
                    className="bg-red-600 text-white py-1 px-3 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    거절
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 text-lg text-center">
            아직 신청한 사람이 없습니다.
          </p>
        )}
      </div>
    </>
  );
};

export default StudyUserList;
