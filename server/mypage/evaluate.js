import { Meteor } from "meteor/meteor";
import { UserScores } from "/imports/api/collections";

Meteor.methods({
  //평가하기, 누락된 팀원 평가지 체크
  evaluate: (userId, datas) => {
    //누락된 팀원 목록
    const missing = [];

    datas.forEach((data) => {
      const { to, score } = data;

      //팀원 평가지의 항목이 누락되었는지 확인
      const isComplete = [
        "manner",
        "mentoring",
        "passion",
        "communication",
        "time",
      ].every((key) => score[key] !== undefined && score[key] !== null);

      //누락된 평가가 있다면 missing 배열에 넣기
      if (!isComplete) {
        const to = Meteor.users.findOne({ _id: to });
        missing.push(to.username);
      } else {
        //평가지가 다 체크돼 있다면 UserScore 컬렉션에 평가 점수 업데이트
        const userScores = UserScores.findOne({ from: userId, to });

        if (userScores) {
          UserScores.update(
            { _id: userScores._id },
            { $set: { score, isDone: true } }
          );
        } else {
          console.error("평가 score 업데이트에서 문제 있음");
        }
      }
    });

    if (missing.length > 0) {
      throw new Meteor.Error(
        400,
        `${missing.join(", ")}님의 평가가 누락되었습니다}`
      );
    }

    return { success: true, message: "팀원 평가가 완료되었습니다" };
  },
});
