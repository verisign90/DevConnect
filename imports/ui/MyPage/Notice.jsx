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
    if (message.includes("승인")) {
      return `/detail/${studyId}`;
    } else if (message.includes("신청자")) {
      return `/studyUserList/${studyId}`;
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
