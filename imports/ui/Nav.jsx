import React from "react";
import { Link } from "react-router-dom";
import { useTracker } from "meteor/react-meteor-data";
import { Notices } from "/imports/api/collections";

export default () => {
  //Notices 컬렉션에서 읽지 않은 알림 개수 가져오기
  const { user, readFalseCount } = useTracker(() => {
    const user = Meteor.user();
    const readFalseCount = Notices.find({
      userId: user._id,
      read: false,
    }).count();

    return { user, readFalseCount };
  });

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
            <li>
              <Link to="/notice">알림페이지 ({readFalseCount})</Link>
            </li>

            <li>
              <Link to="/write">모집글 작성</Link>
            </li>
          </ul>
        </nav>
      </header>
    </>
  );
};
