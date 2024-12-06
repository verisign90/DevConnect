import { Meteor } from "meteor/meteor";
import { UserScores } from "/imports/api/collections";

Meteor.methods({
  //평가하기
  evaluate: (userId, datas) => {
    datas.forEach((data) => {
      const { to, score } = data;

      const userScores = UserScores.findOne({ from: userId, to });

      if (userScores) {
        UserScores.update(
          { _id: userScores._id },
          { $set: { score, isDone: true } }
        );
      } else {
        console.error("평가 score 업데이트에서 문제 있음");
      }
    });
  },
});
