import { Meteor } from "meteor/meteor";
import { Studys, StudyUsers, Comments } from "/imports/api/collections";

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
    //현재 로그인한 사용자의 id 가져오기(참여하기 버튼 클릭한 사용자)
    const userId = Meteor.userId();

    //참여 신청한 유저의 점수, 모집글에서 요구하는 점수 가져오기
    const user = Meteor.users.findOne({ _id: userId });
    const userScore = user.profile.score;
    const study = Studys.findOne({ _id: studyId });
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

/* 대기, 승인, 거절, 퇴장
=> 대기, 승인일 경우 자유롭게 참여 취소가 가능하다
=> 승인 됐을 때 참여 취소하면 status는 퇴장으로 바뀐다
=> 거절 됐을 때 참여 취소가 불가능하다 */
