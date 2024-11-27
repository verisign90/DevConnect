import React, { useRef, useState } from "react";

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

  const nameRef = useRef(null);
  const passwordRef = useRef(null);
  const emailRef = useRef(null);
  const [role, setRole] = useState("backend");
  const [myStack, setMyStack] = useState([]);

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

  //회원가입
  const join = () => {
    const user = {
      username: nameRef.current.value,
      password: passwordRef.current.value,
      emails: [
        {
          address: emailRef.current.value,
          verified: false,
        },
      ],
      profile: {
        role: role,
        techStack: myStack,
      },
    };
    Accounts.createUser(user);
    alert("가입되었습니다");
  };

  return (
    <>
      <h2>회원가입</h2>
      <input type="text" ref={nameRef} placeholder="닉네임을 입력해 주세요" />
      <br />
      <input
        type="text"
        ref={passwordRef}
        placeholder="비밀번호를 입력해 주세요"
      />
      <br />
      <input type="text" ref={emailRef} placeholder="이메일을 입력해 주세요" />
      <br />

      <label>
        <input
          type="radio"
          value="backend"
          name="role"
          checked={role === "backend"}
          onChange={() => setRole("backend")}
        />{" "}
        백엔드
      </label>
      <label>
        <input
          type="radio"
          value="frontend"
          name="role"
          checked={role === "frontend"}
          onChange={() => setRole("frontend")}
        />{" "}
        프론트엔드
      </label>
      <br />

      <label>
        <select onChange={selectStack} value="" disabled={myStack.length === 5}>
          <option value="" disabled>
            기술스택
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

      <button onClick={join}>회원가입</button>
    </>
  );
};

export default Join;
