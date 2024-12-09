import { Meteor } from "meteor/meteor";
import {
  Studys,
  StudyUsers,
  Comments,
  Notices,
} from "/imports/api/collections";

Meteor.methods({
  //작성한 모집글 정보 가져오기
  getStudy: (id) => {
    const study = Studys.findOne({ _id: id });

    //조회수 증가
    if (study) {
      Studys.update({ _id: id }, { $inc: { views: 1 } });

      //study 문서에 작성자의 username, image 필드 추가
      const user = Meteor.users.findOne({ _id: study.userId });
      if (user) {
        study.username = user.username;
        study.image = user.profile.image;
      }
    }

    return study;
  },

  //삭제
  delete: (studyId) => {
    return Studys.remove({ _id: studyId });
  },

  //참여하기
  join: (studyId) => {
    const study = Studys.findOne({ _id: studyId });
    const userId = Meteor.userId();

    //이미 시작한 프로젝트엔 참여 신청할 수 없음
    if (study.status === "시작") {
      throw new Meteor.Error("alreadyStart", "이미 시작한 프로젝트입니다");
    }

    //이미 시작한 프로젝트가 3개 이상일 경우 어떤 모집글에도 신청 불가
    //StudyUsers에서 현재 로그인한 사용자가 승인된 상태인 문서 모두 가져오기
    const approveStudys = StudyUsers.find({
      userId: userId,
      status: "승인",
    }).fetch();
    //내가 승인된 모집글의 studyId 추출
    const approveStudyIds = approveStudys.map((studyUser) => studyUser.studyId);
    //내가 참여한 모집글 중에 status가 시작인 모집글 개수 가져오기
    const startStudyCount = Studys.find({
      _id: { $in: approveStudyIds },
      status: "시작",
    }).count();

    if (startStudyCount >= 3) {
      throw new Meteor.Error(
        "tooManyProject",
        "이미 참여 중인 프로젝트가 3개이므로 더 이상 참여 신청이 불가합니다"
      );
    }

    //현재 로그인한 사용자의 id 가져오기(참여하기 버튼 클릭한 사용자)
    //참여 신청한 유저의 점수, 모집글에서 요구하는 점수 가져오기
    const user = Meteor.users.findOne({ _id: userId });
    const userScore = user.profile.score;
    const studyScore = study.score;

    //score 객체에서 키만 배열로 반환 ["manner", "mentoring", "passion", "communication", "time"]
    const scoreKey = Object.keys(studyScore);
    //유저의 점수와 모집글에서 요구하는 점수 비교
    for (const key of scoreKey) {
      if (userScore[key] < studyScore[key]) {
        return {
          success: false,
          message:
            "작성자가 요구하는 점수보다 부족하여 참여 신청이 불가능합니다.",
        };
      }
    }

    //모집글에서 요구하는 점수보다 이상일 경우 신청 가능
    StudyUsers.insert({
      studyId: studyId,
      userId: userId,
      status: "대기",
      createdAt: new Date(),
    });

    //어디에 내가 참여 신청을 했는지 알림 전송
    Notices.insert({
      studyId: studyId,
      userId: userId,
      message: `${study.title}에 참여 신청이 완료되었습니다`,
      read: false,
      createdAt: new Date(),
    });

    //작성자에게 참여 버튼을 누른 신청자가 있다는 알림 전송
    Notices.insert({
      studyId: study._id,
      userId: study.userId,
      message: `${study.title}에 새로운 신청자가 있습니다`,
      read: false,
      createdAt: new Date(),
    });

    return { success: true };
  },

  //참여 취소하기
  cancelJoin: (studyId) => {
    const userId = Meteor.userId();

    //거절된 사용자는 참여 취소 불가능(다시 신청하지 못하도록)
    if (
      StudyUsers.findOne({ studyId: studyId, userId: userId, status: "거절" })
    ) {
      throw new Meteor.Error(
        "LeaderReject",
        "팀장 권한으로 참여 취소가 불가능합니다"
      );
    }

    return StudyUsers.remove({ studyId: studyId, userId: userId });
  },

  //댓글 작성
  commentInsert: (data) => {
    const user = Meteor.users.findOne({ _id: data.userId });

    return Comments.insert({
      studyId: data.studyId,
      userId: data.userId,
      username: user.username,
      image: user.profile?.image,
      comment: data.comment,
      createdAt: new Date(),
    });
  },
});
