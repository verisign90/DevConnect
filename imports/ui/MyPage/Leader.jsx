import React from "react";
import { useFormAction, useParams } from "react-router-dom";
import { useTracker } from "meteor/react-meteor-data";
import { Studys } from "/imports/api/collections";

//팀장페이지
const Leader = () => {
  const { id } = useParams();

  const { user, study } = useTracker(() => {
    const user = Meteor.user();
    const study = Studys.findOne({ _id: id });

    return {
      user: user,
      study: study,
    };
  });

  return (
    <>
      <h2>팀장 페이지</h2>
      <h3>프로젝트 정보</h3>
      제목: {study.title}
    </>
  );
};

export default Leader;
