import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTracker } from "meteor/react-meteor-data";
import { Notices, Studys } from "/imports/api/collections";

export default () => {
  const navigate = useNavigate();

  //읽지 않은 알림 개수, 모집중/시작인 문서 개수 추적
  const { user, readFalseCount, studyCount } = useTracker(() => {
    const user = Meteor.user();
    if (!user) {
      return { user: null, readFalseCount: 0 };
    }

    //Notices 컬렉션에서 읽지 않은 알림 개수 가져오기
    const readFalseCount = Notices.find({
      userId: user._id,
      read: false,
    }).count();

    //Studys 컬렉션에서 모집중, 시작인 문서 개수 가져오기
    const studyCount = Studys.find({
      userId: user._id,
      status: { $in: ["모집중", "시작"] },
    }).count();

    return { user, readFalseCount, studyCount };
  });

  //모집글을 3개 이상 작성했을 경우 더 이상 작성 불가
  const handleClick = (e) => {
    console.log("handleClick, studyCount: ", studyCount);
    const study = Studys.find({
      userId: user._id,
      status: { $in: ["모집중", "시작"] },
    }).fetch();
    console.log(study);

    if (studyCount >= 3) {
      e.preventDefault();
      alert("프로젝트 모집글은 3개까지만 작성할 수 있습니다");
      navigate("/");
    }
  };

  return (
    <>
      <header>
        <nav>
          <ul>
            <li>
              <Link to="/">프로젝트 목록조회</Link>
            </li>
            <li>
              <Link to="/postInsert">NotFound</Link>
            </li>

            <li>
              <Link to="/login">로그인</Link>
            </li>
            <li>
              <Link to="/join">회원가입</Link>
            </li>
            <li>
              <Link to="/resetPassword">비밀번호 변경</Link>
            </li>

            <li>
              <Link to="/myProfile">내 프로필</Link>
            </li>
            <li>
              <Link to="/editProfile">프로필 수정</Link>
            </li>
            <li>
              <Link to="/myList">내 프로젝트</Link>
            </li>
            {user && (
              <li>
                <Link to="/notice">알림페이지 ({readFalseCount})</Link>
              </li>
            )}

            <li>
              <Link to="/write" onClick={handleClick}>
                모집글 작성
              </Link>
            </li>
          </ul>
        </nav>
      </header>
    </>
  );
};
