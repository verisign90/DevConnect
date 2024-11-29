import React from "react";
import { Link } from "react-router-dom";

export default () => {
  return (
    <>
      <header>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/postDetail/testID">DÒetailPage</Link>
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
              <Link to="/editProfile">프로필 수정</Link>
            </li>
            <li>
              <Link to="/resetPassword">비밀번호 변경</Link>
            </li>
            <li>
              <Link to="/write">프로젝트 모집</Link>
            </li>
          </ul>
        </nav>
      </header>
    </>
  );
};
