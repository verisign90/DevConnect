import { Meteor } from "meteor/meteor";
import { Studys } from "/imports/api/collections";

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
});
