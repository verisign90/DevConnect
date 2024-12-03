import { Meteor } from "meteor/meteor";
import { Studys } from "/imports/api/collections";
import "/imports/lib/utils.js";

Meteor.methods({
  //모집중 -> 프로젝트 시작으로 status 변경
  statusUpdate: (studyId) => {
    const startDate = new Date().toStringYMD();

    Studys.update(
      { _id: studyId },
      { $set: { status: "프로젝트 시작", startDate: startDate } }
    );
  },
});
