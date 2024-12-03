import React from "react";
import { useParams } from "react-router-dom";

const StudyUserList = () => {
  const { id } = useParams(); //studyId

  return (
    <>
      <h2>신청자 목록</h2>
    </>
  );
};

export default StudyUserList;
