import React, { useRef, useState } from "react";
import { Meteor } from "meteor/meteor";

//회원가입
const Join = () => {
  //기술스택 목록
  const stackList = [
    "Java",
    "NodeJS",
    "Kotlin",
    "Mysql",
    "MongoDB",
    "Python",
    "Oracle",
    "AWS",
    "Spring",
    "Azure",
    "NextJS",
    "Kubernetes",
    "Javascript",
    "Flutter",
    "Docker",
    "Typescript",
    "Swift",
    "Django",
    "React",
    "ReactNative",
  ];

  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("backend");
  const [myStack, setMyStack] = useState([]);
  const [nameCheck, setNameCheck] = useState(false); //중복확인 했는지 여부

  //selectbox에서 선택한 기술스택을 중복되지 않게 myStack에 추가
  const selectStack = (e) => {
    const select = e.target.value;

    if (select && !myStack.includes(select)) {
      setMyStack([...myStack, select]);
    }
  };

  //선택한 기술스택 삭제
  const deleteStack = (stack) => {
    setMyStack(myStack.filter((st) => st !== stack));
  };

  //이름 중복확인
  const checkName = () => {
    if (!name) {
      alert("이름을 입력해 주세요");
      return;
    }

    Meteor.call("checkName", name, (err, isExist) => {
      if (err) {
        console.error(err);
        alert("서버 에러가 발생했습니다");
        return;
      }

      if (isExist) {
        alert("이미 사용 중인 이름입니다");
      } else {
        alert("사용 가능한 이름입니다");
        setNameCheck(true);
      }
    });
  };

  //회원가입
  const join = (e) => {
    e.preventDefault();

    if (!nameCheck) {
      alert("이름 중복확인을 해주세요");
      return;
    }

    if (myStack.length === 0) {
      alert("기술스택을 최소 1개 선택해 주세요");
      return;
    }

    const user = {
      username: name,
      password: password,
      email: email,
      profile: {
        role: role,
        techStack: myStack,
        image: null,
      },
    };
    Accounts.createUser(user);
    alert("가입되었습니다");
  };

  return (
    <>
      <h2>회원가입</h2>
      <form onSubmit={join}>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="이름을 입력해 주세요"
        />
        <button type="button" onClick={checkName}>
          중복확인
        </button>
        <br />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="비밀번호를 입력해 주세요"
        />
        <br />
        <input
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="이메일을 입력해 주세요"
        />
        <br />

        <label>
          <input
            type="radio"
            value="backend"
            name="role"
            checked={role === "backend"}
            onChange={() => setRole("backend")}
          />
          백엔드{" "}
        </label>
        <label>
          <input
            type="radio"
            value="frontend"
            name="role"
            checked={role === "frontend"}
            onChange={() => setRole("frontend")}
          />
          프론트엔드{" "}
        </label>
        <br />

        <label>
          <select
            onChange={selectStack}
            value=""
            disabled={myStack.length === 5}
          >
            <option value="" disabled>
              기술스택 (최대 5개 선택)
            </option>
            {stackList.map((stack) => (
              <option key={stack} value={stack}>
                {stack}
              </option>
            ))}
          </select>
        </label>
        <br />
        {myStack.length > 0 && (
          <>
            {myStack.map((stack) => (
              <span key={stack} style={{ marginRight: "10px" }}>
                {stack}
                <button onClick={() => deleteStack(stack)}>X</button>
              </span>
            ))}
          </>
        )}
        <br />

        <button type="submit">회원가입</button>
      </form>
    </>
  );
};

export default Join;
