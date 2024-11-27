import { Meteor } from "meteor/meteor";

Meteor.methods({
  //중복확인
  checkName: (name) => {
    const isExist = Meteor.users.findOne({ username: name });

    if (isExist) {
      return true; //중복이면
    } else {
      return false;
    }
  },
});
