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
      <h2>프로젝트 모집글 상세조회페이지</h2>
      모집상태: {project?.status}
      <br />
      모집제목: {project?.title}
      <br />
      작성일: {formatDay(project?.createdAt)}
      <br />
      조회수: {project?.views}
      <br />
      작성자: {project?.username}
      <hr />
      모집분야: {project?.role}
      <br />
      모임형태: {project?.onOff}{" "}
      {project?.onOff !== "온라인" && <span>{project?.location.city}</span>}
      <br />
      참여인원: {project?.memberCount}
      <br />
      기술스택: {project?.techStack.join(" ")}
      <br />
      요구역량{" "}
      {Object.entries(project?.score).map(([field, value]) => (
        <li key={field}>
          {field} : {value}
        </li>
      ))}
      <hr />
      내용: {project.content}
      <hr />
      <button onClick={goMain}>목록</button>
      {writer && (
        <>
          <button onClick={edit}>수정</button>
          <button onClick={() => remove(id)}>삭제</button>
        </>
      )}
      {!writer && project.status === "모집중" && (
        <button onClick={() => (isStudyUser ? cancelJoin(id) : join(id))}>
          {isStudyUser ? "참여신청 취소하기" : "참여신청하기"}
        </button>
      )}
      <h3>프로젝트 참여자</h3>
      {project.image && (
        <img
          src={project.image}
          style={{ width: "90px", height: "90px", borderRadius: "50%" }}
        />
      )}{" "}
      {project.username}
      {ok
        .filter((o) => o.username !== project.username)
        .map((o) => (
          <li key={o._id}>
            {o.profile.image && (
              <img
                src={o.profile.image}
                style={{ width: "60px", height: "60px", borderRadius: "50%" }}
              />
            )}
            {o.username}
          </li>
        ))}
      <h3>댓글 목록</h3>
      <div>
        {comments.map((cmt) => (
          <li key={cmt._id}>
            <p>
              <img
                src={cmt.image}
                style={{ width: "30px", height: "30px", borderRadius: "50%" }}
              />{" "}
              {cmt.username} {cmt.comment}
            </p>
            <p>{formatDay(cmt.createdAt)}</p>
          </li>
        ))}
      </div>
      <hr />
      <h3>댓글 입력창</h3>
      {user ? (
        <>
          {user.profile.image && (
            <img
              src={user.profile.image}
              style={{ width: "60px", height: "60px", borderRadius: "50%" }}
            />
          )}
          {user.username}{" "}
        </>
      ) : (
        <p>로그인하지 않은 사용자는 댓글을 입력할 수 없습니다.</p>
      )}
      <form onSubmit={commentSubmit}>
        <input
          type="text"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="댓글을 입력해 주세요"
        />
        <button>등록</button>
      </form>
    </>
  );
};

export default Detail;
