import { Meteor } from "meteor/meteor";
import { StudyUsers, Studys } from "/imports/api/collections";

Meteor.methods({
  //거절로 status 업데이트
  statusNo: (userId, studyId) => {
    StudyUsers.update(
      { userId: userId, studyId: studyId },
      { $set: { status: "거절" } }
    );
  },

  //승인으로 status 업데이트
  statusOk: (userId, studyId) => {
    const okCount = StudyUsers.find({
      studyId: studyId,
      status: "승인",
    }).count();
    const study = Studys.findOne({ _id: studyId });

    if (okCount < study.memberCount) {
      StudyUsers.update(
        { studyId: studyId, userId: userId },
        { $set: { status: "승인" } }
      );
    } else {
      throw new Meteor.Error(
        "FullMember",
        `목표인원 총 ${study.memberCount}명이 모집되어 팀이 구성되었습니다. 더 이상 승인할 수 없습니다.`
      );
    }
  },
});
