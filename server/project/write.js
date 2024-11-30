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
});
