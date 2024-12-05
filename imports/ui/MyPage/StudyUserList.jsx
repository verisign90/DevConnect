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
      <h2>신청자 목록</h2>
      <ul>
        {wait && wait.length > 0 ? (
          wait.map((w) => (
            <li key={w._id}>
              {w.profile.image && (
                <img
                  src={w.profile.image}
                  style={{ width: "60px", height: "60px", borderRadius: "50%" }}
                />
              )}
              {w.username}{" "}
              <button onClick={() => goProfile(w._id)}>프로필</button>{" "}
              <button onClick={() => statusOk(w._id)}>승인</button>{" "}
              <button onClick={() => statusNo(w._id)}>거절</button>
            </li>
          ))
        ) : (
          <p>아직 신청한 사람이 없습니다</p>
        )}
      </ul>
    </>
  );
};

export default StudyUserList;
