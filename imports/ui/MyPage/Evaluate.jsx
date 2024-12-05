import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTracker } from "meteor/react-meteor-data";
import { Studys, StudyUsers } from "/imports/api/collections";

//평가페이지
const Evaluate = () => {
  const { id } = useParams(); //studyId

  //팀원 목록 추적
  const { user, study, teamMembers } = useTracker(() => {
    const user = Meteor.user();
    const study = Studys.findOne({ _id: id });

    //프로젝트에 참여한 팀원 목록 가져오기
    //1. StudyUsers 컬렉션에서 프로젝트에 참여한 목록 가져오기
    const teamMembers = StudyUsers.find({
      studyId: id,
      status: "승인",
    })
      .fetch()
      //2. Users 컬렉션에서 참여한 유저 객체 가져오기
      .map((studyUser) => Meteor.users.findOne({ _id: studyUser.userId }))
      .filter((member) => member._id !== user._id);

    return { user, study, teamMembers };
  });

  const categories = [
    "manner",
    "communication",
    "passion",
    "time",
    "mentoring",
  ];

  return (
    <>
      <h2>{`${study.title} 평가 페이지`}</h2>
      {teamMembers.map((member) => (
        <li key={member._id}>
          <h3>{member.username}</h3>
          {categories.map()}
        </li>
      ))}
    </>
  );
};

export default Evaluate;
