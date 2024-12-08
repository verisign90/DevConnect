import { Meteor } from "meteor/meteor";
import { UserScores } from "/imports/api/collections";

//평가 받는 사람의 평균 점수를 계산해서 user.profile.score로 갱신
const runAvgScore = (toId) => {
  const total = {
    manner: 0,
    mentoring: 0,
    passion: 0,
    communication: 0,
    time: 0,
  };

  const categories = [
    "manner",
    "mentoring",
    "passion",
    "communication",
    "time",
  ];

  //나를 평가한 사람 수
  const count = UserScores.find({ to: toId, isDone: true }).count();
  //내가 받은 점수 총점
  UserScores.find({ to: toId, isDone: true }).forEach((userScore) => {
    categories.forEach((category) => {
      total[category] += Number(userScore.score[category]);
    });
  });
  console.log("총합: ", total);
  //평균 점수 계산
  categories.forEach((category) => {
    total[category] /= count;
  });
  console.log("평균: ", total);

  //평균 점수를 user.profiles.score로 갱신
  Meteor.users.update({ _id: toId }, { $set: { "profile.score": total } });
};

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
          return;
        }

        runAvgScore(to);
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
