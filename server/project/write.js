import { Meteor } from "meteor/meteor";
import { Studys } from "/imports/api/collections";

Meteor.methods({
  insert: (data) => {
    return Studys.insert({ ...data, createdAt: new Date() });
  },
});
