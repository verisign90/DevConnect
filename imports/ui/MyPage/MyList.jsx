import React from "react";
import { useTracker } from "meteor/react-meteor-data";
import { Link } from "react-router-dom";
import { useNavigate, useParams } from "react-router-dom";
import { Meteor } from "meteor/meteor";
import { Studys, StudyUsers, UserScores } from "/imports/api/collections";
import "/imports/lib/utils.js";

//내가 참여하고 모집한 프로젝트 목록 조회
const MyList = () => {
  const navigate = useNavigate();

  //내가 모집한 리스트와 로그인한 사용자 정보 추적
  const { user, writeList, joinList } = useTracker(() => {
    const user = Meteor.user();

    //writeList : 로그인한 사용자가 작성한 모집글 가져오기
    const writeList = Studys.find({ userId: user._id })
      .fetch()
      .map((study) => {
        //okCount(모집글 승인 유저 수) 필드 추가
        const okCount = StudyUsers.find({
          studyId: study._id,
          status: "승인",
        }).count();
        return { ...study, okCount };
      });

    //내가 승인된 프로젝트 중 모집중이 아닌 프로젝트 가져오기
    //1. StudyUsers 컬렉션에서 내가 승인된 문서 찾기
    const okProject = StudyUsers.find({
      userId: user._id,
      status: "승인",
    }).fetch();
    //2. 승인된 문서의 studyId 추출
    const studyIds = okProject.map((project) => project.studyId);
    //3. 승인된 모집글의 status가 시작, 종료인 것만 추출
    const joinList = Studys.find({
      _id: { $in: studyIds },
      status: { $nin: ["모집중"] },
    })
      .fetch()
      .map((study) => {
        //okCount(모집글 승인 유저 수) 필드 추가
        const okCount = StudyUsers.find({
          studyId: study._id,
          status: "승인",
        }).count();

        //현재 로그인한 사용자가 평가를 마쳤는지 여부
        const isDoneFalseCount = UserScores.find({
          studyId: study._id,
          from: user._id,
          isDone: false,
        }).count();

        const isDoneAllTrue = isDoneFalseCount === 0;

        return { ...study, okCount, isDoneAllTrue };
      });

    return {
      user: user,
      writeList: writeList,
      joinList: joinList,
    };
  });

  //평가페이지로 이동
  const evaluate = (studyId) => {
    navigate(`/evaluate/${studyId}`);
  };

  return (
    <>
      <h2>내 프로젝트</h2>
      <h3>내가 참여한 프로젝트 목록</h3>
      {joinList.length > 0 ? (
        joinList.map((study) => (
          <li key={study._id}>
            <Link to={`/detail/${study._id}`}>
              {study.title} ({study.okCount}/{study.memberCount}){" "}
              {study.status === "시작"
                ? `시작 ${new Date(study.startDate).toStringYMD()}`
                : `시작 ${new Date(
                    study.startDate
                  ).toStringYMD()} 종료 ${new Date(
                    study.endDate
                  ).toStringYMD()}`}{" "}
              {study.techStack.join(" ")}
            </Link>
            {study.status === "종료" && (
              <button
                onClick={() => evaluate(study._id)}
                disabled={study.isDoneAllTrue}
              >
                {study.isDoneAllTrue ? "평가완료" : "평가하기"}
              </button>
            )}
          </li>
        ))
      ) : (
        <p>아직 참여한 프로젝트가 없습니다</p>
      )}

      <h3>내가 모집한 프로젝트 목록</h3>
      {writeList.length > 0 ? (
        writeList.map((study) => (
          <li key={study._id}>
            <Link to={`/leader/${study._id}`}>
              {study.title} ({study.okCount}/{study.memberCount}){" "}
              {study.status === "시작"
                ? `시작 ${new Date(study.startDate).toStringYMD()}`
                : study.status === "종료"
                ? `시작 ${new Date(
                    study.startDate
                  ).toStringYMD()} 종료 ${new Date(
                    study.endDate
                  ).toStringYMD()}`
                : study.status}{" "}
              {study.techStack.join(" ")}
            </Link>
          </li>
        ))
      ) : (
        <p>아직 작성한 모집글이 없습니다</p>
      )}
    </>
  );
};

export default MyList;
