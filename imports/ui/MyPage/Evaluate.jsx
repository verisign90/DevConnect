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

  //평가 제출
  const handleSubmit = () => {
    const datas = teamMembers.map((member) => {
      const score = {
        to: member._id,
        score: {
          manner: document.querySelector(
            `input[name="${member._id}-manner"]:checked`
          ).value,
          mentoring: document.querySelector(
            `input[name="${member._id}-mentoring"]:checked`
          ).value,
          communication: document.querySelector(
            `input[name="${member._id}-communication"]:checked`
          ).value,
          passion: document.querySelector(
            `input[name="${member._id}-passion"]:checked`
          ).value,
          time: document.querySelector(
            `input[name="${member._id}-time"]:checked`
          ).value,
        },
      };
      return score;
    });

    console.log(datas);
    //상호평가지 제출
    Meteor.call("evaluate", user._id, datas, (err, rlt) => {
      if (err) {
        console.error("evaluate 실패: ", err);
      } else {
        console.log("evaluate 성공");
      }
    });
  };

  return (
    <>
      <h2>{`${study.title} 평가 페이지`}</h2>
      {teamMembers.map((member) => (
        <li key={member._id}>
          <h3>{member.username}</h3>
          <div>
            {["manner", "mentoring", "passion", "communication", "time"].map(
              (category) => (
                <div key={category} style={{ marginBottom: "10px" }}>
                  <label>{category}</label>
                  <div style={{ display: "inline-block" }}>
                    {[1, 2, 3, 4, 5].map((scoreVal) => (
                      <label key={scoreVal} style={{ marginRight: "5px" }}>
                        <input
                          type="radio"
                          name={`${member._id}-${category}`}
                          value={scoreVal}
                        />
                        {scoreVal}
                      </label>
                    ))}
                  </div>
                </div>
              )
            )}
          </div>
        </li>
      ))}
      <button onClick={handleSubmit}>평가제출</button>
    </>
  );
};

export default Evaluate;
