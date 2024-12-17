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
      Meteor.call("insert", data, user._id, (err, studyId) => {
        if (err) {
          if (err.error === "missingField") {
            alert(err.reason);
          }
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
  <div className="max-w-6xl mx-auto px-6 py-12 bg-white">
    <h2 className="text-2xl font-bold mb-6 text-gray-900">프로젝트 모집글 작성페이지</h2>

    {/* 제목 입력 */}
    <div className="mb-6">
      <input
        type="text"
        ref={titleRef}
        placeholder="제목을 입력하세요"
        className="w-full rounded-md border-gray-300 shadow-sm py-2 px-4 focus:ring-2 focus:ring-indigo-600 focus:outline-none"
      />
    </div>

    {/* 모집분야 */}
    <div className="mb-6">
      <h4 className="text-lg font-medium mb-2 text-gray-700">모집분야</h4>
      <div className="flex gap-4">
        {["백엔드/프론트엔드", "백엔드", "프론트엔드"].map((value) => (
          <label key={value} className="flex items-center gap-2">
            <input
              type="radio"
              value={value}
              name="role"
              checked={role === value}
              onChange={() => setRole(value)}
              className="text-indigo-600"
            />
            {value}
          </label>
        ))}
      </div>
    </div>

    {/* 모임형태 */}
    <div className="mb-6">
      <h4 className="text-lg font-medium mb-2 text-gray-700">모임형태</h4>
      <div className="flex gap-4">
        {["온라인", "오프라인", "온/오프라인"].map((value) => (
          <label key={value} className="flex items-center gap-2">
            <input
              type="radio"
              value={value}
              name="onOff"
              checked={onOff === value}
              onChange={() => setOnOff(value)}
              className="text-indigo-600"
            />
            {value}
          </label>
        ))}
      </div>
    </div>

    {/* 지역 선택 */}
    {onOff !== "온라인" && (
      <div className="mb-6">
        <h4 className="text-lg font-medium mb-2 text-gray-700">지역</h4>
        <select
          name="location"
          value={city}
          onChange={cityGubun}
          className="w-full rounded-md border-gray-300 py-2 px-4 shadow-sm focus:ring-2 focus:ring-indigo-600 focus:outline-none"
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
      </div>
    )}

    {/* 기술스택 선택 */}
    <div className="mb-6">
      <h4 className="text-lg font-medium mb-2 text-gray-700">기술스택</h4>
      <select
        onChange={selectStack}
        value=""
        disabled={myStack.length === 5}
        className="w-full rounded-md border-gray-300 py-2 px-4 shadow-sm focus:ring-2 focus:ring-indigo-600 focus:outline-none"
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
      {myStack.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {myStack.map((stack) => (
            <span
              key={stack}
              className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full"
            >
              {stack}
              <button
                onClick={() => deleteStack(stack)}
                className="text-indigo-500 hover:text-indigo-700"
              >
                &times;
              </button>
            </span>
          ))}
        </div>
      )}
    </div>

    {/* 요구역량 */}
    <div className="mb-6">
      <h4 className="text-lg font-medium mb-2 text-gray-700">요구역량</h4>
      {["manner", "communication", "passion", "mentoring", "time"].map((category) => (
        <div key={category} className="mb-4">
          <label className="block font-medium text-gray-700 mb-1 capitalize">{category}</label>
          <div className="flex gap-4">
            {["0", "1", "2", "3", "4"].map((value) => (
              <label key={`${category}-${value}`} className="flex items-center gap-2">
                <input
                  type="radio"
                  name={category}
                  value={value}
                  checked={eval(category) === Number(value)}
                  onChange={(e) => scoreRadio(e, eval(`set${category.charAt(0).toUpperCase() + category.slice(1)}`))}
                  className="text-indigo-600"
                />
                {value}
              </label>
            ))}
          </div>
        </div>
      ))}
    </div>

    {/* 프로젝트 설명 */}
    <div className="mb-6">
      <textarea
        ref={contentRef}
        placeholder="프로젝트에 대해 설명해 주세요"
        className="w-full h-40 rounded-md border-gray-300 py-2 px-4 shadow-sm focus:ring-2 focus:ring-indigo-600 focus:outline-none"
      />
    </div>

    {/* 등록 버튼 */}
    <div className="flex justify-end">
      <button
        onClick={submit}
        className="bg-indigo-600 text-white font-semibold py-2 px-6 rounded-md hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-600 focus:outline-none"
      >
        등록하기
      </button>
    </div>
  </div>
</>

  );
};

export default Write;
