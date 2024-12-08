import React from "react";
import { useTracker } from "meteor/react-meteor-data";
import { Link } from "react-router-dom";
import { Meteor } from "meteor/meteor";
import { Notices, Studys } from "/imports/api/collections";
import "/imports/lib/utils.js";

const Notice = () => {
  const { user, notices } = useTracker(() => {
    const user = Meteor.user();
    const notices = Notices.find({ userId: user._id }).fetch();

    return { user, notices };
  });

  return (
    <>
      <h2>알림페이지</h2>
      {notices.map((noti) => (
        <li key={noti._id}>
          <Link to={`/detail/${noti.studyId}`}>{noti.message}</Link>{" "}
          {noti.createdAt.toStringYMDHMS()}
        </li>
      ))}
    </>
  );
};

export default Notice;
