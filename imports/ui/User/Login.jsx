import React, { useEffect, useRef, useState } from "react";
import { useTracker } from "meteor/react-meteor-data";

//회원가입
const Login = () => {
  //현재 로그인 상태를 자동으로 추적해서 컴포넌트 재렌더링
  useTracker(() => {
    //현재 로그인된 사용자 정보 반환
    return [Meteor.user()];
  });

  const nameRef = useRef(null);
  const passwordRef = useRef(null);

  //로그인
  const login = () => {
    Meteor.loginWithPassword(nameRef.current.value, passwordRef.current.value);
  };

  return (
    <>
      <h2>로그인</h2>
      {Meteor.user() ? (
        <>
          <button
            onClick={() => {
              Meteor.logout();
            }}
          >
            로그아웃
          </button>
        </>
      ) : (
        <>
          <input type="text" ref={nameRef} placeholder="이름을 입력해 주세요" />
          <br />
          <input
            type="text"
            ref={passwordRef}
            placeholder="비밀번호를 입력해 주세요"
          />
          <br />
          <button onClick={login}>로그인</button>
        </>
      )}
    </>
  );
};

export default Login;
