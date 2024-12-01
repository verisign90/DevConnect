import React, { useEffect, useState } from "react";
import { useTracker } from "meteor/react-meteor-data";
import { useParams, useNavigate } from "react-router-dom";
import { Meteor } from "meteor/meteor";
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
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [toggle, setToggle] = useState(false); //false : 참여하기, true : 참여취소하기

  //로그인된 사용자 정보 추적
  const { user } = useTracker(() => {
    return { user: Meteor.user() };
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

  if (loading) {
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
        console.error("cancelJoin 실패: ", err);
      } else {
        alert("참여 신청이 취소되었습니다");
        setToggle(false);
      }
    });
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
      작성자: {project.username}
      <hr />
      모집분야: {project.role}
      <br />
      모임형태: {project.onOff}{" "}
      {project.onOff !== "온라인" && <span>{project.location.city}</span>}
      <br />
      참여인원: {project.memberCount}
      <br />
      기술스택: {project.techStack.join(" ")}
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
      {!writer && (
        <button onClick={() => (toggle ? cancelJoin(id) : join(id))}>
          {toggle ? "참여신청 취소하기" : "참여신청하기"}
        </button>
      )}
      <h4>프로젝트 참여자</h4>
      {project.image && (
        <img
          src={project.image}
          style={{ width: "90px", height: "90px", borderRadius: "50%" }}
        />
      )}{" "}
      {project.username}
    </>
  );
};

export default Detail;
