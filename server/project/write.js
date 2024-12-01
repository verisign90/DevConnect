import { Meteor } from "meteor/meteor";
import { Studys } from "/imports/api/collections";

Meteor.methods({
  //모집글 작성
  insert: (data) => {
    return Studys.insert({
      ...data,
      status: "모집중",
      views: 0,
      createdAt: new Date(),
    });
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
