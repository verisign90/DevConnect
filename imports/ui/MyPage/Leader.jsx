import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTracker } from "meteor/react-meteor-data";
import { Meteor } from "meteor/meteor";
import { Studys, StudyUsers } from "/imports/api/collections";

//팀장페이지
const Leader = () => {
  const { id } = useParams(); //studyId
  const navigate = useNavigate();

  const { user, study, ok } = useTracker(() => {
    const user = Meteor.user();
    const study = Studys.findOne({ _id: id });
    const okUsers = StudyUsers.find({ studyId: id, status: "승인" }).fetch();
    const ok = okUsers.map((o) => Meteor.users.findOne(o.userId));

    return {
      user: user,
      study: study,
      ok: ok,
    };
  });

  //상세페이지로 이동
  const goDetail = () => {
    navigate(`/detail/${id}`);
  };

  //프로젝트 시작 버튼 클릭
  const start = () => {
    Meteor.call("statusStart", id, (err) => {
      if (err) {
        if (err.error === "onlyOne") {
          alert(err.reason);
        }
        console.error("statusStart 실패: ", err);
      } else {
        alert("프로젝트를 시작합니다");
      }
    });
  };

  //프로젝트 종료 버튼 클릭
  const end = () => {
    Meteor.call("statusEnd", id, (err) => {
      if (err) {
        console.error("statusEnd 실패: ", err);
      } else {
        alert("프로젝트가 종료되었습니다");
      }
    });
  };

  //신청자 목록으로 이동
  const goStudyUserList = () => {
    navigate(`/studyUserList/${id}`);
  };

  return (
    <>
      <div className="max-w-6xl mx-auto px-6 py-12 bg-white">
        {/* 페이지 제목 */}
        <h2 className="text-2xl font-bold mb-6 text-gray-900">팀장 페이지</h2>

        {/* 프로젝트 정보 */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4 text-gray-700">
            프로젝트 정보
          </h3>

          <div className="space-y-4">
            <p className="text-lg">
              <span className="font-semibold">제목:</span> {study.title}
            </p>

            <div className="flex items-center gap-4">
              <span className="font-semibold text-lg">모집글:</span>
              <button
                onClick={goDetail}
                className="bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                확인하기
              </button>
            </div>

            <div className="flex items-center gap-4">
              <span className="font-semibold text-lg">프로젝트 진행:</span>
              <span className="text-lg">{study.status}</span>
              {study.status === "모집중" && (
                <button
                  onClick={start}
                  disabled={
                    StudyUsers.find({
                      studyId: study._id,
                      status: "승인",
                    }).count() === 1
                  }
                  className={`py-2 px-4 rounded-md text-white font-semibold ${
                    StudyUsers.find({
                      studyId: study._id,
                      status: "승인",
                    }).count() === 1
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-green-600 hover:bg-green-700"
                  }`}
                >
                  프로젝트 시작
                </button>
              )}
              {study.status === "시작" && (
                <button
                  onClick={end}
                  className="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  프로젝트 종료
                </button>
              )}
            </div>

            <p className="text-lg">
              <span className="font-semibold">프로젝트 일정:</span>{" "}
              {study.status === "시작"
                ? `시작 ${new Date(study.startDate).toStringYMD()}`
                : study.status === "종료"
                ? `시작 ${new Date(
                    study.startDate
                  ).toStringYMD()} 종료 ${new Date(
                    study.endDate
                  ).toStringYMD()}`
                : "프로젝트 일정이 등록되지 않았습니다"}
            </p>
          </div>
        </div>

        <hr className="border-t border-gray-300 mb-8" />

        {/* 팀원 정보 */}
        <div>
          <h3 className="text-xl font-semibold mb-4 text-gray-700">
            팀원 정보
          </h3>

          {study.status !== "종료" && (
            <button
              onClick={goStudyUserList}
              className="mb-6 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              팀원 추가
            </button>
          )}

          {/* 팀장 정보 */}
          <div className="flex items-center gap-4 mb-6">
            {user.profile.image ? (
              <img
                src={user.profile.image}
                className="w-24 h-24 rounded-full object-cover border-2 border-gray-300"
                alt="팀장 프로필"
              />
            ) : (
              <span className="inline-block w-24 h-24 overflow-hidden rounded-full bg-gray-100 flex items-center justify-center border-2 border-gray-200">
                <svg
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  className="size-full text-gray-300"
                >
                  <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </span>
            )}
            <div>
              <p className="text-lg font-semibold text-gray-900">팀장</p>
              <p className="text-lg text-gray-700">{user.username}</p>
            </div>
          </div>

          {/* 팀원 목록 */}
          <div className="space-y-4">
            <p className="text-lg font-semibold text-gray-900">팀원 목록</p>
            <ul className="space-y-4">
              {ok
                .filter((o) => o._id !== user._id)
                .map((o) => (
                  <li key={o._id} className="flex items-center gap-4">
                    {o.profile.image && (
                      <img
                        src={o.profile.image}
                        className="w-16 h-16 rounded-full object-cover border-2 border-gray-300"
                        alt="팀원 프로필"
                      />
                    )}
                    <span className="text-lg text-gray-700">{o.username}</span>
                  </li>
                ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default Leader;
