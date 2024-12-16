import React, { useState } from "react";
import { useTracker } from "meteor/react-meteor-data";
import { useNavigate } from "react-router-dom";
import { Meteor } from "meteor/meteor";
import { Studys } from "/imports/api/collections";
import { ChevronDownIcon } from "@heroicons/react/16/solid";
import { MagnifyingGlassIcon } from "@heroicons/react/20/solid";

//메인페이지 프로젝트 목록조회
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
  const [searchTitle, setSearchTitle] = useState("");
  const [sort, setSort] = useState("모집중");
  const [nowPage, setNowPage] = useState(1);
  const navigate = useNavigate();

  //작성글 필터링
  const { filterList, totalPage, data, users, user } = useTracker(() => {
    const user = Meteor.user(); //현재 로그인한 사용자 정보 추적

    let data = Studys.find().fetch();

    //모집분야, 모임형태, 기술스택별 필터링
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

    //제목 검색 필터링
    if (searchTitle.trim() !== "") {
      data = data.filter((study) =>
        study.title.toLowerCase().includes(searchTitle.toLowerCase())
      );
    }

    //최신순, 오래된순, 인기순, 모집중으로 필터링
    if (sort === "최신순") {
      data = data.sort((a, b) => b.createdAt - a.createdAt);
    }
    if (sort === "오래된순") {
      data = data.sort((a, b) => a.createdAt - b.createdAt);
    }
    if (sort === "인기순") {
      data = data.sort((a, b) => b.views - a.views);
    }
    if (sort === "모집중") {
      data = data
        .filter((study) => study.status === "모집중")
        .sort((a, b) => b.createdAt - a.createdAt);
    }

    //페이지당 표시할 게시물 설정
    const itemsPerPage = 5; //페이지당 표시할 항목 개수
    const lastIndex = nowPage * itemsPerPage; //페이지당 마지막 항목의 인덱스. 1페이지면 5.
    const firstIndex = lastIndex - itemsPerPage; //페이지당 첫번째 항목의 인덱스. 1페이지면 0.
    const filterList = data.slice(firstIndex, lastIndex); //페이지당 표시할 항목 설정. 첫 페이지는 0부터 4까지, 총 5개 표시
    const totalPage = Math.ceil(data.length / itemsPerPage); //전체 페이지 수 계산. 항목이 9개라면 9/5=1.x여서 2페이지

    const users = Meteor.users.find().fetch();

    return { filterList, totalPage, data, users, user };
  });

  //페이지 번호 설정
  const pageChange = (pageNumber) => {
    if (pageNumber !== nowPage) {
      setNowPage(pageNumber);
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

  //상세조회페이지로 이동
  const goDetail = (studyId) => {
    navigate(`/detail/${studyId}`);
  };

  return (
    <>
      <div className="bg-white">
        <div className="max-w-7xl pl-6 pr-6 py-12 sm:py-14 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
            프로젝트
          </h2>
        </div>
      </div>

      <div className="flex gap-4 pl-6">
        <div>
          <h4 className="text-base font-medium text-gray-900">모집분야</h4>
          <div className="mt-1 grid grid-cols-1">
            <select
              name="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            >
              <option value="전체">전체</option>
              <option value="백엔드">백엔드</option>
              <option value="프론트엔드">프론트엔드</option>
              <option value="백엔드/프론트엔드">백엔드/프론트엔드</option>
            </select>
          </div>
        </div>

        <div>
          <h4 className="text-base font-medium text-gray-900">모임형태</h4>
          <div className="mt-1 grid grid-cols-1">
            <select
              name="onOff"
              value={onOff}
              onChange={(e) => setOnOff(e.target.value)}
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            >
              <option value="전체">전체</option>
              <option value="온라인">온라인</option>
              <option value="오프라인">오프라인</option>
              <option value="온/오프라인">온/오프라인</option>
            </select>
          </div>
        </div>

        <div>
          <h4 className="text-base font-medium text-gray-900">기술스택</h4>
          <div className="mt-1 grid grid-cols-1">
            <select
              onChange={selectStack}
              value=""
              disabled={myStack.length === 5}
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
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

        <div>
          <h4 className="text-base font-medium text-gray-900">정렬</h4>
          <div className="mt-1 grid grid-cols-1">
            <select
              name="sort"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            >
              <option value="모집중">모집중</option>
              <option value="최신순">최신순</option>
              <option value="오래된순">오래된순</option>
              <option value="인기순">인기순</option>
            </select>
          </div>
        </div>

        <div className="flex flex-1 items-center justify-center px-6 lg:ml-6 lg:justify-end">
          <div className="grid w-full max-w-lg grid-cols-1 lg:max-w-xs">
            <input
              name="search"
              type="search"
              placeholder="검색어를 입력해 주세요"
              value={searchTitle}
              onChange={(e) => setSearchTitle(e.target.value)}
              className="col-start-1 row-start-1 block w-full rounded-md border-0 py-1.5 pl-10 pr-3 text-base text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 mt-7"
            />
            <MagnifyingGlassIcon
              aria-hidden="true"
              className="pointer-events-none col-start-1 row-start-1 ml-3 size-5 self-center text-gray-400 mt-7"
            />
          </div>
        </div>
      </div>

      <div
        className="bg-indigo-100 flex items-center w-full"
        style={{
          height: "60px",
          overflow: "auto",
          marginTop: "20px",
        }}
      >
        <div className="w-full pl-6 pr-6 flex flex-wrap gap-2 items-center">
          {myStack.length > 0 ? (
            myStack.map((stack) => (
              <span
                key={stack}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-200 text-indigo-800 border border-gray-500"
              >
                {stack}
                <button
                  onClick={() => deleteStack(stack)}
                  className="ml-2 inline-flex items-center justify-center w-4 h-4 text-indigo-400 hover:text-indigo-600"
                >
                  <svg
                    className="w-3 h-3"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </span>
            ))
          ) : (
            <p className="text-gray-500 text-sm">
              아직 선택한 기술스택이 없습니다
            </p>
          )}
        </div>
      </div>

      <div
        className="bg-white flex items-center"
        style={{
          width: "1460px",
          height: "60px",
        }}
      >
        <div className="w-full pl-6 pr-6 flex items-center">
          <h4 className="text-lg tracking-tight text-gray-900">
            <span className="font-bold text-indigo-600">{data.length}</span>
            개의 프로젝트
          </h4>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filterList.map((study) => {
          const user = users.find((u) => u._id === study.userId);

          return (
            <div
              key={study._id}
              className="overflow-hidden rounded-md bg-white shadow-sm cursor-pointer ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
              onClick={() => goDetail(study._id)}
            >
              <div className="px-4 py-5 sm:p-6">
                <div className="flex justify-between items-center mb-2">
                  <p className="text-xs text-gray-500">
                    {study.role} {study.onOff}{" "}
                    {study.onOff !== "온라인" && study.location.city}
                  </p>
                  <p className="text-xs text-gray-500">조회수 {study.views}</p>
                </div>
                <h3 className="text-base font-semibold text-gray-900 mb-2 truncate">
                  {study.title}
                </h3>
                <div className="flex flex-wrap gap-1 mb-4">
                  {study.techStack &&
                    study.techStack.map((stack) => (
                      <span
                        key={stack}
                        className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full"
                      >
                        #{stack}
                      </span>
                    ))}
                </div>
              </div>
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    {user?.profile.image ? (
                      <img
                        src={user.profile.image}
                        className="w-6 h-6 rounded-full mr-2"
                        alt={user.username}
                      />
                    ) : null}
                    <p className="text-xs font-medium text-gray-900 truncate">
                      {user?.username}
                    </p>
                  </div>
                  <p className="text-xs text-gray-500">
                    {formatDay(study.createdAt)}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div>
        <button
          onClick={() => pageChange(nowPage - 1)}
          disabled={nowPage === 1}
        >
          이전
        </button>
        {[...Array(totalPage)].map((_, index) => (
          <button
            key={index}
            onClick={() => pageChange(index + 1)}
            style={{ fontWeight: nowPage === index + 1 ? "bold" : "normal" }}
          >
            {index + 1}
          </button>
        ))}
        <button
          onClick={() => pageChange(nowPage + 1)}
          disabled={nowPage === totalPage}
        >
          다음
        </button>
      </div>
    </>
  );
};

export default Project;
