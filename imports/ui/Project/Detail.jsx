import React, { useEffect, useState } from "react";
import { useTracker } from "meteor/react-meteor-data";
import { useParams, useNavigate } from "react-router-dom";
import { Meteor } from "meteor/meteor";
import { Comments, StudyUsers } from "/imports/api/collections";
import "/imports/lib/utils.js";

//모집글 상세조회
const Detail = () => {
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

  // 기술스택 뱃지 색깔
  const stackColors = {
    backend: "bg-yellow-100 text-yellow-800",
    database: "bg-green-100 text-green-800",
    cloud: "bg-blue-100 text-blue-800",
    frontend: "bg-pink-100 text-pink-800",
    mobile: "bg-purple-100 text-purple-800",
    other: "bg-indigo-100 text-indigo-800",
  };

  // 기술스택 카테고리
  const stackCategories = {
    backend: ["Java", "NodeJS", "Kotlin", "Python", "Spring", "Django"],
    database: ["Mysql", "MongoDB", "Oracle"],
    cloud: ["AWS", "Azure", "Kubernetes", "Docker"],
    frontend: ["NextJS", "Javascript", "Typescript", "React", "ReactNative"],
    mobile: ["Flutter", "Swift"],
    other: ["Other"],
  };

  // 스택에 맞는 카테고리 반환
  const getStackCategory = (stack) => {
    for (const [category, stacks] of Object.entries(stackCategories)) {
      if (stacks.includes(stack)) return category;
    }
    return "other";
  };

  //요구역량 스타일
  const badgeStyles = {
    manner: "bg-amber-200 text-amber-600 fill-amber-400",
    communication: "bg-lime-200 text-lime-700 fill-lime-500",
    passion: "bg-cyan-200 text-cyan-800 fill-cyan-500",
    mentoring: "bg-emerald-200 text-emerald-700 fill-emerald-500",
    time: "bg-fuchsia-200 text-fuchsia-700 fill-fuchsia-500",
  };

  const { id } = useParams(); //작성된 studyId
  const [project, setProject] = useState({});
  const [loading, setLoading] = useState(true);
  const [toggle, setToggle] = useState(false); //false : 참여하기, true : 참여취소하기
  const [comment, setComment] = useState("");
  const navigate = useNavigate();

  //로그인된 사용자 정보, 실시간 댓글 데이터 추적
  const { user, comments, ok, isStudyUser } = useTracker(() => {
    const user = Meteor.user();

    //작성글에 달린 댓글 가져오기
    const comments = Comments.find(
      { studyId: id },
      { sort: { createdAt: 1 } }
    ).fetch();

    //현재 모집글에 승인된 유저의 User 객체 가져오기
    //모집글에 승인된 유저 모두 가져오기
    const okUsers = StudyUsers.find({ studyId: id, status: "승인" }).fetch();
    const ok = okUsers.map((o) => Meteor.users.findOne(o.userId));

    //StudyUsers에서 모집글에 참여한 기록이 있는지 확인
    const isStudyUser = user
      ? StudyUsers.findOne({
          studyId: id,
          userId: user._id,
        })
      : null;

    return {
      user: user || null,
      comments: comments,
      ok: ok,
      isStudyUser: isStudyUser,
    };
  });

  //작성한 모집글 정보 가져오기
  useEffect(() => {
    Meteor.call("getStudy", id, (err, rlt) => {
      if (err) {
        console.error("getStudy 실패: ", err);
      } else {
        setProject(rlt);
        setLoading(false);
      }
    });
  }, []);

  if (loading || !project) {
    return <div>로딩 중...</div>;
  }

  //메인페이지로 이동
  const goMain = () => {
    navigate("/");
  };

  //현재 로그인한 사용자의 id와 글 작성자의 id를 비교하여 작성자인지 아닌지 확인
  const writer = user && project && user._id === project.userId;

  //수정버튼 클릭 시 작성페이지로 이동
  const edit = () => {
    navigate(`/write/${id}`);
  };

  //글 삭제
  const remove = (id) => {
    Meteor.call("delete", id, (err) => {
      if (err) {
        console.error("delete 실패: ", err);
      } else {
        alert("삭제되었습니다");
        navigate("/");
      }
    });
  };

  //참여하기
  const join = (id) => {
    Meteor.call("join", id, (err, rlt) => {
      if (err) {
        //이미 시작한 프로젝트 참여 불가, 참여 중인 프로젝트가 3개 이상일 경우 모집글 신청 불가
        if (err.error === "alreadyStart" || err.error === "tooManyProject") {
          alert(err.reason);
        }
        console.error("join 실패: ", err);
      } else if (rlt.success) {
        alert("참여 신청이 전송되었습니다");
        setToggle(true);
      } else {
        alert(rlt.message);
      }
    });
  };

  //참여 취소하기
  const cancelJoin = (id) => {
    Meteor.call("cancelJoin", id, (err) => {
      if (err) {
        if (err.error === "LeaderReject") {
          alert(err.reason);
        }
        console.error("cancelJoin 실패: ", err);
      } else {
        alert("참여 신청이 취소되었습니다");
        setToggle(false);
      }
    });
  };

  //댓글 데이터 서버에 제출
  const commentSubmit = (e) => {
    e.preventDefault();

    const data = {
      studyId: id,
      userId: user._id,
      comment: comment,
    };

    if (comment) {
      Meteor.call("commentInsert", data, (err) => {
        if (err) {
          console.error("commentInsert 실패: ", err);
        } else {
          console.log("댓글 작성 성공");
          setComment("");
        }
      });
    }
  };

  return (
    <>
      <div className="bg-white max-w-6xl mx-auto mb-8">
        <div className="border-b border-gray-300 p-6 sm:p-10 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl mb-4 lg:mb-0">
            <span className="inline-flex items-center rounded-full bg-teal-200 px-3 py-0.5 text-base font-semibold text-teal-800 mb-2">
              {project?.status}
            </span>
            <br />
            {project?.title}
            <br />
            <span className="text-base text-gray-500">
              작성일 {formatDay(project?.createdAt)} · 조회수 {project?.views}
            </span>
            <br />
            <span className="text-lg font-semibold text-gray-700">
              작성자: {project?.username}
            </span>
          </h2>
        </div>

        <div className="w-full pl-6 pr-6 pt-5 pb-10 sm:pt-5 sm:pb-10 bg-white border-b border-gray-300">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="flex items-center">
                <h3 className="font-semibold text-lg w-24">모집분야</h3>
                <p className="inline-flex items-center rounded-md bg-gray-100 px-2 py-1 text-base font-semibold text-gray-600">
                  {project?.role}
                </p>
              </div>
              <div className="flex items-center">
                <h3 className="font-semibold text-lg w-24">참여인원</h3>
                <p className="font-base text-lg">{project?.memberCount}명</p>
              </div>
              <div className="flex items-center">
                <h3 className="font-semibold text-lg w-24">기술스택</h3>
                <div className="flex flex-wrap gap-1">
                  {project?.techStack.map((stack) => {
                    const category = getStackCategory(stack);
                    const colorClasses = stackColors[category];
                    return (
                      <span
                        key={stack}
                        className={`inline-flex items-center rounded-md px-2 py-1 text-base font-semibold ${colorClasses}`}
                      >
                        {stack}
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center">
                <h3 className="font-semibold text-lg w-24">모임형태</h3>
                <span className="inline-flex items-center rounded-md bg-red-100 px-2 py-1 text-base font-semibold text-red-700">
                  {project?.onOff}{" "}
                  {project?.onOff !== "온라인" &&
                    ` · ${project?.location.city}`}
                </span>
              </div>

              <div className="flex items-start">
                <h3 className="font-semibold text-lg w-24">요구역량</h3>
                <ul className="list-none">
                  {Object.entries(project?.score).map(([field, value]) => {
                    const style =
                      badgeStyles[field] ||
                      "bg-gray-100 text-gray-600 fill-gray-400";
                    const [bgColor, textColor, fillColor] = style.split(" ");
                    return (
                      <li key={field} className="mb-2">
                        <span
                          className={`inline-flex items-center gap-x-1.5 rounded-md ${bgColor} px-1.5 py-0.5 text-sm font-semibold ${textColor}`}
                        >
                          <svg
                            viewBox="0 0 6 6"
                            aria-hidden="true"
                            className={`size-1.5 ${fillColor}`}
                          >
                            <circle r={3} cx={3} cy={3} />
                          </svg>
                          {field.charAt(0).toUpperCase() + field.slice(1)}:{" "}
                          {value}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* 프로젝트 내용 */}
        <div className="w-full pl-6 pr-6 pt-5 pb-10 sm:pt-5 sm:pb-10 bg-white border-b border-gray-300">
          <div className="max-w-7xl">
            <h2 className="text-2xl font-medium tracking-tight text-gray-900 sm:text-lg py-12 sm:py-14">
              {project?.content}
            </h2>
          </div>
        </div>

        {/* 버튼 그룹 */}
        <div className="p-6">
          <div className="flex gap-4">
            <button
              onClick={goMain}
              className="bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600"
            >
              목록
            </button>
            {writer && (
              <>
                <button
                  onClick={edit}
                  className="bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700"
                >
                  수정
                </button>
                <button
                  onClick={() => remove(id)}
                  className="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700"
                >
                  삭제
                </button>
              </>
            )}
            {!writer && project.status === "모집중" && (
              <button
                onClick={() => (isStudyUser ? cancelJoin(id) : join(id))}
                className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700"
              >
                {isStudyUser ? "참여신청 취소하기" : "참여신청하기"}
              </button>
            )}
          </div>
        </div>

        <div className="p-6">
          <h3 className="text-xl font-semibold mb-4">프로젝트 참여자</h3>
          <div className="flex items-center gap-4">
            {project?.image ? (
              <img
                src={project.image}
                className="w-20 h-20 rounded-full object-cover"
                alt={`${project.username}'s profile`}
              />
            ) : (
              <span className="inline-block w-20 h-20 overflow-hidden rounded-full bg-gray-100">
                <svg
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  className="w-full h-full text-gray-300"
                >
                  <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </span>
            )}
            <span className="text-lg font-medium">{project?.username}</span>
          </div>

          <ul className="mt-4 space-y-2">
            {ok
              .filter((o) => o.username !== project.username)
              .map((o) => (
                <li key={o._id} className="flex items-center gap-4">
                  {o.profile.image ? (
                    <img
                      src={o.profile.image}
                      className="w-14 h-14 rounded-full object-cover"
                      alt={`${o.username}'s profile`}
                    />
                  ) : (
                    <span className="inline-block w-14 h-14 overflow-hidden rounded-full bg-gray-100">
                      <svg
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        className="w-full h-full text-gray-300"
                      >
                        <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    </span>
                  )}
                  <span className="text-lg">{o.username}</span>
                </li>
              ))}
          </ul>
        </div>

        <div className="p-6">
          <h3 className="text-xl font-semibold mb-4">댓글 목록</h3>
          <ul className="space-y-4">
            {comments.map((cmt) => (
              <li key={cmt._id} className="flex items-start gap-4">
                {cmt.image ? (
                  <img
                    src={cmt.image}
                    className="w-10 h-10 rounded-full object-cover"
                    alt={`${cmt.username}'s profile`}
                  />
                ) : (
                  <span className="inline-block size-10 overflow-hidden rounded-full bg-gray-100">
                    <svg
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      className="size-full text-gray-300"
                    >
                      <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </span>
                )}
                <div>
                  <p className="font-medium">{cmt.username}</p>
                  <p className="text-gray-700">{cmt.comment}</p>
                  <p className="text-sm text-gray-500">
                    {formatDay(cmt.createdAt)}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="p-6 border-t border-gray-200">
          <h3 className="text-xl font-semibold mb-4">댓글 입력창</h3>
          {user ? (
            <>
              <div className="flex items-center gap-4 mb-4">
                {user.profile.image ? (
                  <img
                    src={user.profile.image}
                    className="w-14 h-14 rounded-full object-cover"
                    alt={`${user.username}'s profile`}
                  />
                ) : (
                  <span className="inline-block w-14 h-14 overflow-hidden rounded-full bg-gray-100">
                    <svg
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      className="w-full h-full text-gray-300"
                    >
                      <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </span>
                )}
                <span className="text-lg font-medium">{user.username}</span>
              </div>
              <form
                onSubmit={commentSubmit}
                className="flex flex-col md:flex md:flex-row gap-2"
              >
                <input
                  type="text"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="댓글을 입력해 주세요"
                  className="flex-1 rounded-md border-gray-300 py-2 px-4 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  type="submit"
                  className="bg-indigo-600 text-white py-2 px-6 rounded-md hover:bg-indigo-700"
                >
                  등록
                </button>
              </form>
            </>
          ) : (
            <p className="text-gray-500 mb-4">
              로그인하지 않은 사용자는 댓글을 입력할 수 없습니다.
            </p>
          )}
        </div>
      </div>
    </>
  );
};

export default Detail;
