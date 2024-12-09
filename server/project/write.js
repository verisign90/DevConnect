import { Meteor } from "meteor/meteor";
import { Studys, StudyUsers } from "/imports/api/collections";

Meteor.methods({
  //모집글 작성 후 작성자를 승인된 참여자로 설정
  insert: (data, userId) => {
    const studyId = Studys.insert({
      ...data,
      status: "모집중",
      views: 0,
      createdAt: new Date(),
    });

    StudyUsers.insert({
      studyId: studyId,
      userId: userId,
      status: "승인",
    });

    return studyId;
  },

  //모집글 가져오기
  select: (id) => {
    return Studys.findOne({ _id: id });
  },

  //글 수정
  update: (id, data) => {
    const study = Studys.find({ _id: id });

    return Studys.update({ _id: id }, { $set: { ...data } });
  },
});
