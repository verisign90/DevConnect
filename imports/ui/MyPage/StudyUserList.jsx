import React from "react";
import { useParams } from "react-router-dom";
import { useTracker } from "meteor/react-meteor-data";
import { Meteor } from "meteor/meteor";
import { StudyUsers, Studys } from "/imports/api/collections";

//신청자 목록 페이지
const StudyUserList = () => {
  const { id } = useParams(); //studyId

  //대기, 거절인 사용자 / 로그인한 사용자 추적
  const { study, wait, no, user } = useTracker(() => {
    const user = Meteor.user();
    const study = Studys.findOne({ studyId: id });

    if (!study) {
      return { study: null, wait: [], no: [], user: null };
    }

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

  if (!study) {
    return <div>로딩 중...</div>;
  }

  //프로젝트 참여 인원을 초과하지 않게 status를 승인으로 update
  const statusOk = (userId) => {
    const okCount = StudyUsers.find({ studyId: id, status: "승인" }).count();

    if (study && okCount < study.memberCount) {
      StudyUsers.update(
        { userId: userId, studyId: id },
        { $set: { status: "승인" } }
      );
    } else {
      alert(
        `프로젝트 참여 인원 총 ${study.memberCount}명이 모였습니다. 프로젝트를 시작하세요`
      );
    }
  };

  return (
    <>
      <h2>신청자 목록</h2>
      <ul>
        {wait.map((w) => (
          <li key={w._id}>
            {w.profile.image && (
              <img
                src={w.profile.image}
                style={{ width: "60px", height: "60px", borderRadius: "50%" }}
              />
            )}
            {w.username} <button>프로필</button>{" "}
            <button onClick={() => statusOk(w._id)}>승인</button>{" "}
            <button>거절</button>
          </li>
        ))}
      </ul>
    </>
  );
};

export default StudyUserList;
