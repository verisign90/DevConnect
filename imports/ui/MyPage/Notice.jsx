import React, { useEffect } from "react";
import { useTracker } from "meteor/react-meteor-data";
import { Link } from "react-router-dom";
import { Meteor } from "meteor/meteor";
import { Notices } from "/imports/api/collections";
import "/imports/lib/utils.js";

//알림페이지
const Notice = () => {
  //현재 로그인한 사용자의 Notice 문서 내림차순으로 모두 가져오기
  const { user, notices } = useTracker(() => {
    const user = Meteor.user();
    const notices = Notices.find(
      { userId: user._id },
      { sort: { createdAt: -1 } }
    ).fetch();

    //const notices = Notices.find({ userId: user._id }).fetch();
    return { user, notices };
  });

  //컴포넌트가 렌더링될 때 알림 모두 읽음 처리
  useEffect(() => {
    Meteor.call("readTrue", user._id, (err) => {
      if (err) {
        console.error("readTrue 실패: ", err);
      }
    });
  }, []);

  //이동할 경로 결정
  const navi = (message, studyId) => {
    //신청하신 프로젝트에 승인 되었습니다
    if (message.includes("승인")) {
      return `/detail/${studyId}`;
      //새로운 신청자가 있습니다
    } else if (message.includes("신청자")) {
      return `/studyUserList/${studyId}`;
      //선택되지 않으셨습니다. 다른 모임을 찾아 보세요
    } else if (message.includes("모임")) {
      return `/detail/${studyId}`;
      //프로젝트가 종료되었습니다. 팀원을 평가해 주세요
    } else if (message.includes("평가")) {
      return `/myList`;
    }
  };

  //알림 삭제
  const removeMsg = (notiId) => {
    Meteor.call("removeMsg", notiId, user._id, (err) => {
      if (err) {
        console.error("removeMsg 실패: ", err);
      } else {
        console.log("remove 성공: ", notiId);
      }
    });
  };

  return (
    <>
    <div className="max-w-6xl mx-auto px-6 py-12 bg-white">
      {/* 페이지 제목 */}
      <h2 className="text-2xl font-bold mb-6 text-gray-900">알림 페이지</h2>
  
      {/* 알림 리스트 */}
      {notices.length > 0 ? (
        <ul className="space-y-4">
          {notices.map((noti) => (
            <li
              key={noti._id}
              className="flex items-center justify-between bg-gray-50 p-4 rounded-md shadow-sm border border-gray-200"
            >
              <div>
                <Link
                  to={navi(noti.message, noti.studyId)}
                  className="text-lg font-medium text-indigo-600 hover:underline"
                >
                  {noti.message}
                </Link>
                <p className="text-sm text-gray-500 mt-1">
                  {noti.createdAt.toStringYMDHMS()}
                </p>
              </div>
  
              <button
                onClick={() => removeMsg(noti._id)}
                className="text-red-500 hover:text-red-700 focus:outline-none"
              >
                &times;
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">알림이 없습니다.</p>
      )}
    </div>
  </>
  
  );
};

export default Notice;
