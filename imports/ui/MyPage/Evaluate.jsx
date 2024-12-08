import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTracker } from "meteor/react-meteor-data";
import { Studys, StudyUsers } from "/imports/api/collections";

//평가페이지
const Evaluate = () => {
  const { id } = useParams(); //studyId
  const navigate = useNavigate();

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
    //누락된 항목이 있는 팀원 목록
    const missing = [];

    //평가해야되는 팀원별 누락된 항목이 있는지 없는지에 따라 분기 처리
    const datas = teamMembers.map((member) => {
      const score = {};
      let isComplete = true;

      //팀원의 평가 항목과 값을 가져오기
      ["manner", "mentoring", "communication", "passion", "time"].forEach(
        (category) => {
          const input = document.querySelector(
            `input[name="${member._id}-${category}"]:checked`
          );

          //평가항목에 대한 값이 있다면 score 객체에 넣기
          if (input) {
            score[category] = input.value;
          } else {
            //평가항목에 대한 값이 누락된 게 있다면 false
            isComplete = false;
          }
        }
      );

      //평가가 누락된 username을 missing 배열에 넣기
      if (!isComplete) {
        missing.push(member.username);
      }

      return { to: member._id, score };
    });

    console.log("missing: ", missing);
    //평가가 누락된 username이 있다면
    if (missing.length > 0) {
      alert(`${missing.join(", ")}님의 평가가 모두 완료되지 않았습니다`);
      return;
    }

    console.log(datas);
    //상호평가지 제출
    Meteor.call("evaluate", user._id, datas, (err, rlt) => {
      if (err) {
        if (err.reason === 400) {
          alert(err.reason);
        } else {
          console.error("evaluate 실패: ", err);
        }
      } else {
        alert(rlt.message);
        navigate("/myList");
      }
    });
  };

  const goProfile = (userId) => {
    navigate(`/myProfile/${userId}`);
  };

  return (
    <>
      <h2>{`${study.title} 평가 페이지`}</h2>
      {teamMembers.map((member) => (
        <li key={member._id}>
          <h3 style={{ display: "inline-block", marginRight: "10px" }}>
            {member.username}
          </h3>
          <button onClick={() => goProfile(member._id)}>프로필</button>
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
