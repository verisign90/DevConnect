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
      <h2>알림페이지</h2>
      {notices.map((noti) => (
        <li key={noti._id}>
          <Link to={navi(noti.message, noti.studyId)}>{noti.message}</Link>{" "}
          {noti.createdAt.toStringYMDHMS()}{" "}
          <button onClick={() => removeMsg(noti._id)}>X</button>
        </li>
      ))}
    </>
  );
};

export default Notice;
