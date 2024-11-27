import React, { useEffect, useState } from "react";
import { useTracker } from "meteor/react-meteor-data";

//회원가입
const Login = () => {
  //현재 로그인 상태를 자동으로 추적해서 컴포넌트 재렌더링
  // useTracker(() => {
  //   //현재 로그인된 사용자 정보 반환
  //   return [Meteor.user()];
  // }, []);

  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  console.log(1, error);

  useEffect(() => {
    console.log("Login component mounted");
    return () => {
      console.log("Login component unmounted");
    };
  }, []);

  //로그인
  const login = (e) => {
    // e.preventDefault();

    if (!name) {
      setError("이름을 입력해 주세요");
      return;
    }
    if (!password) {
      setError("비밀번호를 입력해 주세요");
      return;
    }

    // setTimeout(() => {
    //   setError("아이디 또는 비밀번호가 올바르지 않습니다");
    // }, 1000);

    Meteor.loginWithPassword(name, password, (err) => {
      if (err) {
        // setError("아이디 또는 비밀번호가 올바르지 않습니다");
        // Session.set("error2", "아이디 비번 오류.");
      } else {
        console.log("로그인 성공");
        // setError("");
      }
    });
  };
  console.log(2, error);
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
        <div>
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
          {(error === "비밀번호를 입력해 주세요" ||
            error === "아이디 또는 비밀번호가 올바르지 않습니다") && (
            <span style={{ color: "red" }}>{error}</span>
          )}
          <br />
          {Session.get("error2") && "아이디 또는 비밀번호가 올바르지 않습니다"}
          <button onClick={login}>로그인</button>
        </div>
      )}
    </>
  );
};

export default Login;
