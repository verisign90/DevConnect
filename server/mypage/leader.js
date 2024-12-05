import { Meteor } from "meteor/meteor";
import { Studys } from "/imports/api/collections";
import "/imports/lib/utils.js";

Meteor.methods({
  //모집중 -> 시작으로 status 변경
  statusStart: (studyId) => {
    const startDate = new Date().toStringYMD();

    return Studys.update(
      { _id: studyId },
      { $set: { status: "시작", startDate: startDate } }
    );
  },

  //시작 -> 종료로 status 변경
  statusEnd: (studyId) => {
    const endDate = new Date().toStringYMD();

    return Studys.update(
      { _id: studyId },
      { $set: { status: "종료", endDate: endDate } }
    );
  },
});
