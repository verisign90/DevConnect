import React, { useState } from "react";
import { useTracker } from "meteor/react-meteor-data";
import { Meteor } from "meteor/meteor";
import { Studys } from "/imports/api/collections";

const Project = () => {
  //작성일을 다양한 형식으로 설정
  const formatDay = (createdAt) => {
    const now = new Date();
    const createdDate = new Date(createdAt);
    const diff = Math.floor((now - createdDate) / 1000);

    if (diff < 60) {
      return `${diff}초 전`;
    } else if (diff < 3600) {
      const minutes = Math.floor(diff / 60);
      return `${minutes}분 전`;
    } else if (diff < 86400) {
      const hours = Math.floor(diff / 3600);
      return `${hours}시간 전`;
    } else if (diff < 172800) {
      return `어제`;
    } else if (diff < 604800) {
      const days = Math.floor(diff / 86400);
      return `${days}일 전`;
    } else {
      return createdDate.toStringYMD(); //yyyy년 mm월 dd일
    }
  };
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

  const [role, setRole] = useState("전체");
  const [onOff, setOnOff] = useState("전체");
  const [myStack, setMyStack] = useState([]);

  //모집분야, 모임형태, 기술스택별로 작성글 필터링, 유저 데이터 추적
  const { filterList, users } = useTracker(() => {
    let data = Studys.find().fetch();

    if (role !== "전체") {
      data = data.filter((study) => study.role === role);
    }
    if (onOff !== "전체") {
      data = data.filter((study) => study.onOff === onOff);
    }
    if (myStack.length > 0) {
      data = data.filter((study) =>
        myStack.every((stack) => study.techStack.includes(stack))
      );
    }

    const users = Meteor.users.find().fetch();

    return { filterList: data, users };
  });

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

  return (
    <>
      <h2>프로젝트 목록조회</h2>
      <div style={{ display: "flex", gap: "10px" }}>
        <div>
          <h4>모집분야</h4>
          <select
            name="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="전체">전체</option>
            <option value="백엔드">백엔드</option>
            <option value="프론트엔드">프론트엔드</option>
            <option value="백엔드/프론트엔드">백엔드/프론트엔드</option>
          </select>
        </div>

        <div>
          <h4>모임형태</h4>
          <select
            name="onOff"
            value={onOff}
            onChange={(e) => setOnOff(e.target.value)}
          >
            <option value="전체">전체</option>
            <option value="온라인">온라인</option>
            <option value="오프라인">오프라인</option>
            <option value="온/오프라인">온/오프라인</option>
          </select>
        </div>

        <div>
          <h4>기술스택</h4>
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
        </div>
      </div>
      {myStack.length > 0 &&
        myStack.map((stack) => (
          <span key={stack} style={{ marginRight: "10px" }}>
            {stack}
            <button onClick={() => deleteStack(stack)}>X</button>
          </span>
        ))}

      <ul>
        {filterList.map((study) => {
          const user = users.find((u) => u._id === study.userId);

          return (
            <li key={study._id}>
              <p>
                {study.role} {study.onOff}{" "}
                {study.onOff !== "온라인" && study.location.city}
              </p>
              <h3>{study.title}</h3>
              <p>
                {study.techStack &&
                  study.techStack.map((stack) => (
                    <span key={stack} style={{ marginRight: "10px" }}>
                      #{stack}
                    </span>
                  ))}
                {formatDay(study.createdAt)} 조회수 {study.views}
              </p>
              <p>
                {user.profile.image && (
                  <img
                    src={user.profile.image}
                    style={{
                      width: "100px",
                      height: "100px",
                      borderRadius: "50%",
                    }}
                  />
                )}
                {user.username}
              </p>
              <hr />
            </li>
          );
        })}
      </ul>
    </>
  );
};

export default Project;
