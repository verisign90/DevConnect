import React from "react";
import { useTracker } from "meteor/react-meteor-data";
import { Link, useParams } from "react-router-dom";
import { Meteor } from "meteor/meteor";
import { Notices, Studys } from "/imports/api/collections";
import "/imports/lib/utils.js";

const Notice = () => {
  const { user, notices } = useTracker(() => {
    const user = Meteor.user();
    const notices = Notices.find({ userId: user._id }).fetch();

    console.log("userId: ", user._id);
    console.log("notices: ", notices);
    return { user, notices };
  });

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

  return (
    <>
      <h2>알림페이지</h2>
      {notices.map((noti) => (
        <li key={noti._id}>
          <Link to={navi(noti.message, noti.studyId)}>{noti.message}</Link>{" "}
          {noti.createdAt.toStringYMDHMS()}
        </li>
      ))}
    </>
  );
};

export default Notice;
