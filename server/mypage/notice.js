import { Meteor } from "meteor/meteor";
import { Notices } from "/imports/api/collections";

Meteor.methods({
  //read: false를 true로 모두 업데이트
  readTrue: (userId) => {
    Notices.update(
      { userId: userId, read: false },
      { $set: { read: true } },
      { multi: true }
    );
  },

  //알림 삭제
  removeMsg: (notiId, userId) => {
    Notices.remove({ userId: userId, _id: notiId });
  },
});
