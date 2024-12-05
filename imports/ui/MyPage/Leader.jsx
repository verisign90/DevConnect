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
  console.log("study: ", study);

  //상세페이지로 이동
  const goDetail = () => {
    navigate(`/detail/${id}`);
  };

  //프로젝트 시작 버튼 클릭
  const start = () => {
    Meteor.call("statusStart", id, (err) => {
      if (err) {
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

  const goUserScore = () => {};

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
      {study.status === "시작" && <button onClick={end}>프로젝트 종료</button>}
      <br />
      프로젝트일정:{" "}
      {study.status === "시작"
        ? `시작 ${study.startDate}`
        : study.status === "종료"
        ? `시작 ${study.startDate} 종료 ${study.endDate}`
        : "프로젝트 일정이 등록되지 않았습니다"}
      <hr />
      <h3>팀원 정보</h3>
      {study.status !== "종료" ? (
        <button onClick={goStudyUserList}>팀원 추가</button>
      ) : (
        <button onClick={goUserScore}>평가하기</button>
      )}
      <br />
      팀장:{" "}
      {user.profile.image && (
        <img
          src={user.profile.image}
          style={{ width: "90px", height: "90px", borderRadius: "50%" }}
        />
      )}
      {user.username}
      <br />
      팀원:{" "}
      {ok
        .filter((o) => o._id !== user._id)
        .map((o) => (
          <li key={o._id}>
            {o.profile.image && (
              <img
                src={o.profile.image}
                style={{ width: "60px", height: "60px", borderRadius: "50%" }}
              />
            )}
            {o.username}
          </li>
        ))}
    </>
  );
};

export default Leader;
