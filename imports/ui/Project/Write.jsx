import React, { useRef, useState } from "react";

const Write = () => {
  const titleRef = useRef("");
  const [role, setRole] = useState("all");
  const [onOff, setOnOff] = useState("online");

  return (
    <>
      <h2>프로젝트 모집페이지</h2>
      <input type="text" ref={titleRef} placeholder="제목을 입력하세요" />

      <h4>모집분야</h4>
      <label>
        <input
          type="radio"
          value="all"
          name="role"
          checked={role === "all"}
          onChange={() => setRole("all")}
        />
        전체{" "}
      </label>
      <label>
        <input
          type="radio"
          value="all"
          name="role"
          checked={role === "backend"}
          onChange={() => setRole("backend")}
        />
        백엔드{" "}
      </label>
      <label>
        <input
          type="radio"
          value="all"
          name="role"
          checked={role === "frontend"}
          onChange={() => setRole("frontend")}
        />
        프론트엔드{" "}
      </label>

      <h4>모임형태</h4>
      <label>
        <input
          type="radio"
          value="online"
          name="onOff"
          checked={onOff === "online"}
          onChange={() => setOnOff("online")}
        />
        온라인{" "}
      </label>
      <label>
        <input
          type="radio"
          value="offline"
          name="onOff"
          checked={onOff === "offline"}
          onChange={() => setOnOff("offline")}
        />
        오프라인{" "}
      </label>
      <label>
        <input
          type="radio"
          value="onOffline"
          name="onOff"
          checked={onOff === "onOffline"}
          onChange={() => setOnOff("onOffline")}
        />
        온/오프라인{" "}
      </label>

      <h4>지역</h4>
    </>
  );
};

export default Write;
