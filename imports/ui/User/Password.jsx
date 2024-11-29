import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Accounts } from "meteor/accounts-base";

const Password = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { token } = useParams();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (token) {
      Accounts.resetPassword(token, password, (err) => {
        if (err) {
          console.error("resetPassword 실패: ", err);
        } else {
          alert("비밀번호가 재설정 되었습니다");
          navigate("/");
        }
      });
    } else {
      //비밀번호 재설정 링크가 포함된 이메일 발송
      Accounts.forgotPassword({ email }, (err) => {
        if (err) {
          console.error("이메일 발송 forgotPassword 실패: ", err);
          console.log(err.reason);
        } else {
          alert("비밀번호 재설정 링크가 이메일로 발송되었습니다");
        }
      });
    }
  };

  return (
    <>
      <h2>비밀번호 변경</h2>
      <form onSubmit={handleSubmit}>
        {!token && (
          <>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="이메일을 입력해 주세요"
            />
          </>
        )}
        {token && (
          <>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호를 입력해 주세요"
            />
          </>
        )}
        <button type="submit">{token ? "변경하기" : "이메일인증"}</button>
      </form>
    </>
  );
};

export default Password;
