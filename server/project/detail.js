import { Meteor } from "meteor/meteor";
import { Studys } from "/imports/api/collections";
import { StudyUsers } from "/imports/api/collections";

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
        console.log(study.image);
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

    return StudyUsers.insert({
      studyId: studyId,
      userId: userId,
      status: "대기",
      createdAt: new Date(),
    });
  },

  //참여 취소하기
  cancelJoin: (studyId) => {
    const userId = Meteor.userId();

    return StudyUsers.remove({ studyId: studyId, userId: userId });
  },
});
