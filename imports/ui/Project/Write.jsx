import React, { useRef, useState, useEffect } from "react";
import { useTracker } from "meteor/react-meteor-data";
import { Meteor } from "meteor/meteor";
import { useNavigate, useParams } from "react-router-dom";
import Location from "/imports/ui/Location.jsx";

//모집글 작성
const Write = () => {
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

  const titleRef = useRef(null);
  const [role, setRole] = useState("백엔드/프론트엔드");
  const [onOff, setOnOff] = useState("온라인");
  const [city, setCity] = useState("");
  const [gubun, setGubun] = useState("");
  const [gubunList, setGubunList] = useState([]);
  const [memberCount, setMemberCount] = useState("");
  const [myStack, setMyStack] = useState([]);
  const [manner, setManner] = useState(0); //매너
  const [communication, setCommunication] = useState(0); //의사소통
  const [passion, setPassion] = useState(0); //참여도
  const [time, setTime] = useState(0); //시간준수
  const [mentoring, setMentoring] = useState(0); //재능기부
  const contentRef = useRef(null);
  const navigate = useNavigate();
  const { id } = useParams(); //studyId

  //로그인된 사용자 정보 추적
  const { user } = useTracker(() => {
    return { user: Meteor.user() };
  });

  //수정페이지 조회 시, id 파라미터에 맞는 데이터 가져오기
  useEffect(() => {
    if (id) {
      Meteor.call("select", id, (err, rlt) => {
        if (err) {
          console.error("getStudyData 실패: ", err);
        } else {
          console.log(rlt);
          titleRef.current.value = rlt.title;
          setRole(rlt.role);
          setOnOff(rlt.onOff);
          setCity(rlt.location.city);

          const filterGubun = Location.find(
            (loc) => loc.city === rlt.location.city
          );
          setGubunList(filterGubun.gubun);

          setGubun(rlt.location.gubun);
          setMemberCount(rlt.memberCount);
          setMyStack(rlt.techStack);
          setManner(rlt.score.manner);
          setCommunication(rlt.score.communication);
          setPassion(rlt.score.passion);
          setMentoring(rlt.score.mentoring);
          setTime(rlt.score.time);
          contentRef.current.value = rlt.content;
        }
      });
    }
  }, [id]);

  //시/도에 해당하는 구/군 목록 보여주기
  const cityGubun = (e) => {
    const selectCity = e.target.value;
    setCity(selectCity);
    setGubun("");

    const filterGubun = Location.find((loc) => loc.city === selectCity);
    if (filterGubun) {
      setGubunList(filterGubun.gubun);
    } else {
      setGubunList([]);
    }
  };

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

  //라디오 버튼에서 선택한 요구역량과 점수
  const scoreRadio = (e, setState) => {
    setState(Number(e.target.value));
  };

  //사용자가 입력하고 선택한 데이터를 서버로 제출하기
  const submit = () => {
    if (!user) {
      alert("로그인 후 작성해 주세요");
      return;
    }

    const data = {
      userId: user._id,
      title: titleRef.current.value,
      role: role,
      onOff: onOff,
      location: {
        city: onOff === "online" ? "" : city,
        gubun: onOff === "online" ? "" : gubun,
      },
      memberCount: memberCount,
      techStack: myStack,
      score: {
        manner,
        communication,
        passion,
        mentoring,
        time,
      },
      content: contentRef.current.value,
    };

    //수정할 경우 update, 작성할 경우 insert
    if (id) {
      Meteor.call("update", id, data, (err) => {
        if (err) {
          console.error("update 실패: ", err);
        } else {
          alert("수정되었습니다");
          navigate(`/detail/${id}`);
        }
      });
    } else {
      Meteor.call("insert", data, (err, studyId) => {
        if (err) {
          console.error("insert 실패: ", err);
        } else {
          alert("모집글이 업로드 되었습니다");
          navigate(`/detail/${studyId}`);
        }
      });
    }
  };

  return (
    <>
      <h2>프로젝트 모집글 작성페이지</h2>
      <input type="text" ref={titleRef} placeholder="제목을 입력하세요" />
      <h4>모집분야</h4>
      <label>
        <input
          type="radio"
          value="all"
          name="role"
          checked={role === "백엔드/프론트엔드"}
          onChange={() => setRole("백엔드/프론트엔드")}
        />
        백엔드/프론트엔드{" "}
      </label>
      <label>
        <input
          type="radio"
          value="backend"
          name="role"
          checked={role === "백엔드"}
          onChange={() => setRole("백엔드")}
        />
        백엔드{" "}
      </label>
      <label>
        <input
          type="radio"
          value="frontend"
          name="role"
          checked={role === "프론트엔드"}
          onChange={() => setRole("프론트엔드")}
        />
        프론트엔드{" "}
      </label>
      <h4>모임형태</h4>
      <label>
        <input
          type="radio"
          value="online"
          name="onOff"
          checked={onOff === "온라인"}
          onChange={() => setOnOff("온라인")}
        />
        온라인{" "}
      </label>
      <label>
        <input
          type="radio"
          value="offline"
          name="onOff"
          checked={onOff === "오프라인"}
          onChange={() => setOnOff("오프라인")}
        />
        오프라인{" "}
      </label>
      <label>
        <input
          type="radio"
          value="onOffline"
          name="onOff"
          checked={onOff === "온/오프라인"}
          onChange={() => setOnOff("온/오프라인")}
        />
        온/오프라인{" "}
      </label>
      <h4>지역</h4>
      <select
        name="location"
        value={city}
        onChange={cityGubun}
        disabled={onOff === "online"}
      >
        <option value="" disabled>
          시/도를 선택하세요
        </option>
        {Location.map((loc) => (
          <option key={loc.city} value={loc.city}>
            {loc.city}
          </option>
        ))}
      </select>
      {city && onOff !== "online" && (
        <select
          name="gubun"
          value={gubun}
          onChange={(e) => setGubun(e.target.value)}
        >
          <option value="" disabled>
            구/군을 선택하세요
          </option>
          {gubunList.map((gubun) => (
            <option key={gubun} value={gubun}>
              {gubun}
            </option>
          ))}
        </select>
      )}
      <h4>총 참여 인원 수</h4>
      <select
        value={memberCount}
        onChange={(e) => setMemberCount(e.target.value)}
      >
        <option value="" disabled>
          참여 인원 수를 선택하세요
        </option>
        <option value="2">2명</option>
        <option value="3">3명</option>
        <option value="4">4명</option>
        <option value="5">5명</option>
        <option value="6">6명</option>
      </select>
      <h4>기술스택</h4>
      <label>
        <select onChange={selectStack} value="" disabled={myStack.length === 5}>
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
      <h4>요구역량</h4>
      <label>manner</label>{" "}
      {["0", "1", "2", "3"].map((value) => (
        <label key={`manner-${value}`}>
          <input
            type="radio"
            name="manner"
            value={value}
            checked={manner === Number(value)}
            onChange={(e) => scoreRadio(e, setManner)}
          />
          {value}
        </label>
      ))}
      <br />
      <label>communication</label>{" "}
      {["0", "1", "2", "3"].map((value) => (
        <label key={`communication-${value}`}>
          <input
            type="radio"
            name="communication"
            value={value}
            checked={communication === Number(value)}
            onChange={(e) => scoreRadio(e, setCommunication)}
          />
          {value}
        </label>
      ))}
      <br />
      <label>passion</label>{" "}
      {["0", "1", "2", "3"].map((value) => (
        <label key={`passion-${value}`}>
          <input
            type="radio"
            name="passion"
            value={value}
            checked={passion === Number(value)}
            onChange={(e) => scoreRadio(e, setPassion)}
          />
          {value}
        </label>
      ))}
      <br />
      <label>mentoring</label>{" "}
      {["0", "1", "2", "3"].map((value) => (
        <label key={`mentoring-${value}`}>
          <input
            type="radio"
            name="mentoring"
            value={value}
            checked={mentoring === Number(value)}
            onChange={(e) => scoreRadio(e, setMentoring)}
          />
          {value}
        </label>
      ))}
      <br />
      <label>time</label>{" "}
      {["0", "1", "2", "3"].map((value) => (
        <label key={`time-${value}`}>
          <input
            type="radio"
            name="time"
            value={value}
            checked={time === Number(value)}
            onChange={(e) => scoreRadio(e, setTime)}
          />
          {value}
        </label>
      ))}
      <br />
      <textarea
        style={{ width: "600px", height: "200px" }}
        ref={contentRef}
        placeholder="프로젝트에 대해 설명해 주세요"
      />
      <br />
      <button onClick={submit}>등록하기</button>
    </>
  );
};

export default Write;
