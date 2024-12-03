import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTracker } from "meteor/react-meteor-data";
import { Meteor } from "meteor/meteor";
import { Studys } from "/imports/api/collections";

//팀장페이지
const Leader = () => {
  const { id } = useParams(); //studyId
  const navigate = useNavigate();

  const { user, study } = useTracker(() => {
    const user = Meteor.user();
    const study = Studys.findOne({ _id: id });

    return {
      user: user,
      study: study,
    };
  });

  //상세페이지로 이동
  const goDetail = () => {
    navigate(`/detail/${id}`);
  };

  const start = () => {
    Meteor.call("statusUpdate", id, (err) => {
      if (err) {
        console.error("statusUpdate 실패: ", err);
      }
    });
  };

  //신청자 목록으로 이동
  const goStudyUserList = () => {
    navigate(`/studyUserList/${id}`);
  };

  return (
    <>
      <h2>팀장 페이지</h2>
      <h3>프로젝트 정보</h3>
      제목: {study.title}
      <br />
      모집글: <button onClick={goDetail}>확인하기</button>
      <br />
      프로젝트진행: {study.status}{" "}
      {study.status === "모집중" && (
        <button onClick={start}>프로젝트 시작</button>
      )}
      <br />
      프로젝트일정:{" "}
      {study.status === "프로젝트 시작"
        ? `시작 ${study.startDate}`
        : "프로젝트 일정이 등록되지 않았습니다"}
      <hr />
      <h3>팀원 정보</h3>
      팀장: {user.username} <button onClick={goStudyUserList}>팀원 추가</button>
    </>
  );
};

export default Leader;
