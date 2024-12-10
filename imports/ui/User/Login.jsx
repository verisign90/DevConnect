import React, { useEffect, useState } from "react";
import { useTracker } from "meteor/react-meteor-data";

//로그인
const Login = () => {
  //현재 로그인 상태를 자동으로 추적해서 컴포넌트 재렌더링
  useTracker(() => {
    //현재 로그인된 사용자 정보 반환
    return [Meteor.user()];
  });

  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  //로그인
  const login = (e) => {
    e.preventDefault();

    if (!name) {
      setError("이름을 입력해 주세요");
      return;
    }
    if (!password) {
      setError("비밀번호를 입력해 주세요");
      return;
    }

    Meteor.loginWithPassword(name, password, (err) => {
      if (err) {
        alert("이름 또는 비밀번호가 올바르지 않습니다");
        setError("이름 비번 오류");
      } else {
        console.log("로그인 성공");
        setError("");
      }
    });
  };

  // useEffect(() => {
  //   console.log("Error 상태 업데이트됨:", error);
  // }, [error]);

  return (
    <>
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
        <form onSubmit={login}>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="이름을 입력해 주세요"
          />
          <br />
          {error === "이름을 입력해 주세요" && (
            <span style={{ color: "red" }}>{error}</span>
          )}
          <br />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="비밀번호를 입력해 주세요"
          />
          <br />
          {error === "비밀번호를 입력해 주세요" && (
            <span style={{ color: "red" }}>{error}</span>
          )}
          <br />
          <button type="submit">로그인</button>
        </form>
      )}
    </>
  );
};

export default Login;
