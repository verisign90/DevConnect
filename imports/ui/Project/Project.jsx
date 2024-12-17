import React, { useState } from "react";
import { useTracker } from "meteor/react-meteor-data";
import { useNavigate } from "react-router-dom";
import { Meteor } from "meteor/meteor";
import { Studys } from "/imports/api/collections";
import { ChevronDownIcon } from "@heroicons/react/16/solid";
import { MagnifyingGlassIcon } from "@heroicons/react/20/solid";
import {
  ArrowLongLeftIcon,
  ArrowLongRightIcon,
} from "@heroicons/react/20/solid";

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

  //기술스택 뱃지 색깔
  // const stackColors = {
  //   backend: "bg-yellow-100 text-yellow-800",
  //   database: "bg-green-100 text-green-800",
  //   cloud: "bg-blue-100 text-blue-800",
  //   frontend: "bg-pink-100 text-pink-800",
  //   mobile: "bg-purple-100 text-purple-800",
  //   other: "bg-indigo-100 text-indigo-800",
  // };

  // 기술스택 뱃지 아웃라인 스타일
  const stackColors = {
    backend: "border border-yellow-500 text-yellow-800 bg-white",
    database: "border border-green-500 text-green-800 bg-white",
    cloud: "border border-blue-500 text-blue-800 bg-white",
    frontend: "border border-pink-500 text-pink-800 bg-white",
    mobile: "border border-purple-500 text-purple-800 bg-white",
    other: "border border-indigo-500 text-indigo-800 bg-white",
  };

  //기술스택 카테고리
  const stackCategories = {
    backend: ["Java", "NodeJS", "Kotlin", "Python", "Spring", "Django"],
    database: ["Mysql", "MongoDB", "Oracle"],
    cloud: ["AWS", "Azure", "Kubernetes", "Docker"],
    frontend: ["NextJS", "Javascript", "Typescript", "React", "ReactNative"],
    mobile: ["Flutter", "Swift"],
    other: ["Other"],
  };

  //스택에 맞는 카테고리 반환
  const getStackCategory = (stack) => {
    //stackCategories 객체의 키와 값을 [category, stacks] 형태의 배열로 변환
    for (const [category, stacks] of Object.entries(stackCategories)) {
      if (stacks.includes(stack)) return category;
    }
    return "other";
  };

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
    const itemsPerPage = 6; //페이지당 표시할 항목 개수
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
      <div className="max-w-6xl mx-auto">
        <div className="bg-white">
          <div className="bg-gray-50 pl-6 pr-6 py-12 sm:py-14 lg:flex lg:items-center lg:justify-between">
            <h2 className="text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
              프로젝트
            </h2>
            <div>
              <img
                src="/icons/project_icon01.svg"
                className="w-10 h-auto"
                alt=""
              />
            </div>
          </div>
        </div>

        <div className="flex gap-4 p-6 py-6 flex-col md:flex-row">
          <div>
            <h4 className="text-base font-medium text-gray-900 ">모집분야</h4>
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

          <div className="flex flex-1 items-center justify-center px-0 md:px-6 lg:ml-6 lg:justify-end">
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
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-white text-indigo-800 border border-indigo-300"
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

        <div className="bg-white flex items-center h-20 w-full">
          <div className="w-full pl-6 pr-6 flex items-center">
            <h4 className="text-lg tracking-tight text-gray-900">
              <span className="font-bold text-indigo-600">{data.length}</span>
              개의 프로젝트
            </h4>
          </div>
        </div>

        <div className="px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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



                    {/* 오리지널 */}
                    <div className="flex flex gap-2">
                      <span className="inline-flex items-center rounded-md bg-gray-100 px-1 py-1 text-sm font-semibold text-gray-600">
                        {study.role}
                      </span>
                  <span className="inline-flex items-center rounded-md bg-blue-100 px-1 py-1 text-sm font-semibold text-blue-700">
                        {study.onOff}
                        {study.onOff !== "온라인" &&
                          ` · ${study.location.city}`}
                      </span>
                    </div>

                    {/* 아웃라인 스타일 적용 */}
                    {/* <div className="flex items-center gap-2">
                      <span className="inline-flex items-center rounded-md border border-gray-500 px-1 py-1 text-sm font-semibold text-gray-600">
                        {study.role}
                      </span>

                      <span className="inline-flex items-center rounded-md border border-red-500 px-1 py-1 text-sm font-semibold text-red-700">
                        {study.onOff}
                        {study.onOff !== "온라인" &&
                          ` · ${study.location.city}`}
                      </span>
                    </div> */}

             
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2 truncate">
                    {study.title}
                  </h3>
                  <div className="flex h-[84px] flex-wrap gap-2 mb-4 pt-5">
                    {study.techStack &&
                      study.techStack.map((stack) => {
                        const category = getStackCategory(stack);
                        const colorClasses = stackColors[category];
                        return (
                          <span
                            key={stack}
                            className={`inline-flex items-center h-[30px] rounded-md px-2 py-1 text-sm font-semibold ${colorClasses}`}
                          >
                            #{stack}
                          </span>
                        );
                      })}
                  </div>
                </div>

                <div className="px-4 py-4 sm:px-6 border-t border-gray-300">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      {user?.profile.image ? (
                        <img
                          src={user.profile.image}
                          className="w-10 h-10 rounded-full mr-2"
                          alt={user.username}
                        />
                      ) : (
                        <span className="inline-block w-10 h-10 overflow-hidden rounded-full bg-gray-100 mr-2">
                          <svg
                            className="h-full w-full text-gray-300"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                          </svg>
                        </span>
                      )}
                      <p className="text-base font-semibold text-gray-900 truncate">
                        {user?.username}
                      </p>
                    </div>


                    <div>
                    <p className="text-sm text-right text-gray-500">
                      {formatDay(study.createdAt)}
                    </p>

                    <p className="text-sm text-right text-gray-500">
                      조회수 {study.views}
                    </p>
                    </div>
                    
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <nav className="flex items-center justify-between border-t border-gray-200 px-4 sm:px-0 mt-[40px] mb-[40px]">
          <div className="-mt-px flex w-0 flex-1">
            <button
              onClick={() => pageChange(nowPage - 1)}
              disabled={nowPage === 1}
              className="inline-flex items-center border-t-2 border-transparent pr-1 pt-4 text-base font-semibold text-gray-500 hover:border-gray-300 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowLongLeftIcon
                className="mr-3 h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
              이전
            </button>
          </div>
          <div className="hidden md:-mt-px md:flex">
            {[...Array(totalPage)].map((_, index) => (
              <button
                key={index}
                onClick={() => pageChange(index + 1)}
                className={`inline-flex items-center border-t-4 px-4 pt-4 text-lg font-bold ${
                  nowPage === index + 1
                    ? "border-indigo-500 text-indigo-600"
                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
          <div className="-mt-px flex w-0 flex-1 justify-end">
            <button
              onClick={() => pageChange(nowPage + 1)}
              disabled={nowPage === totalPage}
              className="inline-flex items-center border-t-2 border-transparent pl-1 pt-4 text-base font-semibold text-gray-500 hover:border-gray-300 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              다음
              <ArrowLongRightIcon
                className="ml-3 h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            </button>
          </div>
        </nav>
      </div>
    </>
  );
};

export default Project;
