import React from "react";
import { useTracker } from "meteor/react-meteor-data";
import { Link } from "react-router-dom";
import { Meteor } from "meteor/meteor";
import { Studys, StudyUsers } from "/imports/api/collections";

//내가 참여하고 모집한 프로젝트 목록 조회
const MyList = () => {
  //내가 모집한 리스트와 로그인한 사용자 정보 추적
  const { user, writeList } = useTracker(() => {
    const user = Meteor.user();

    //writeList : 로그인한 사용자가 작성한 모집글에 okCount(모집글 승인 유저 수) 필드 추가
    const writeList = Studys.find({ userId: user._id })
      .fetch()
      .map((study) => {
        const okCount = StudyUsers.find({
          studyId: study._id,
          status: "승인",
        }).count();
        return { ...study, okCount };
      });

    return { user, writeList };
  });

  return (
    <>
      <h2>내 프로젝트</h2>
      <h3>내가 참여한 프로젝트 목록</h3>
      <h3>내가 모집한 프로젝트 목록</h3>
      {writeList.map((study) => (
        <li key={study._id}>
          <Link to={`/leader/${study._id}`}>
            {study.title} ({study.okCount}/{study.memberCount}){" "}
            {study.status === "시작"
              ? `시작 ${study.startDate}`
              : study.status === "종료"
              ? `시작 ${study.startDate} 종료 ${study.endDate}`
              : study.status}{" "}
            {study.techStack.join(" ")}
          </Link>
        </li>
      ))}
    </>
  );
};

export default MyList;
