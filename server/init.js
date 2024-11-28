import { userScores } from "/imports/api/collections";
import "/imports/lib/utils.js";

//기술스택 목록
const stackList = [
  "Java",
  "NodeJS",
  "Kotlin",
  "Mysql",
  "MongoDB",
  "Python",
  "Oracle",
  "AWS",
  "Spring",
  "Azure",
  "NextJS",
  "Kubernetes",
  "Javascript",
  "Flutter",
  "Docker",
  "Typescript",
  "Swift",
  "Django",
  "React",
  "ReactNative",
];

// Meteor.users.remove({});
userScores.remove({});

//admin이 없다면
if (!Meteor.users.findOne({ username: "admin" })) {
  Accounts.createUser({
    username: "admin",
    password: "1234",
  });
}

//일반 유저가 없다면
if (!Meteor.users.findOne({ username: { $ne: "admin" } })) {
  Array.range(0, 20).forEach((i) => {
    Accounts.createUser({
      username: "user" + i,
      password: "1234",
      email: `user${i}@example.com,`,
      profile: {
        role: ["백엔드", "프론트엔드"].random(),
        techStack: stackList.random(1, 5),
        image: null,
        score: {},
      },
    });
  });
}

//유저들의 점수 설정
if (!userScores.findOne()) {
  const users = Meteor.users.find({ username: { $ne: "admin" } }).fetch();

  users.forEach((user, i) => {
    //최초 가입자는 3점으로 설정
    if (i < 10) {
      userScores.insert({
        userId: user._id,
        score: {
          manner: 3,
          mentoring: 3,
          passion: 3,
          communication: 3,
          time: 3,
        },
      });
    } else {
      //프로젝트를 최소 한 번 이상한 사용자 점수 설정
      userScores.insert({
        userId: user._id,
        score: {
          manner: [1, 2, 3, 4, 5].random(),
          mentoring: [1, 2, 3, 4, 5].random(),
          passion: [1, 2, 3, 4, 5].random(),
          communication: [1, 2, 3, 4, 5].random(),
          time: [1, 2, 3, 4, 5].random(),
        },
      });
    }
  });
}

//평가 받은 후 평균 점수를 계산해 유저의 점수로 갱신
if (userScores.find()) {
  Meteor.users.find({ username: { $ne: "admin" } }).forEach((user) => {
    const total = {
      manner: 0,
      mentoring: 0,
      passion: 0,
      communication: 0,
      time: 0,
    };

    //평가 받은 점수 문서 모두 가져오기
    const userScore = userScores.find({ userId: user._id }).fetch();
    console.log(`유저 ${user._id} 점수: `, userScore);
    //평가 문서 개수(평가한 사람 수)
    const memberCount = userScore.length;
    //총합 구하기
    for (let i = 0; i < memberCount; i++) {
      total.manner += userScore.score.manner;
      total.mentoring += userScore.score.mentoring;
      total.passion += userScore.score.passion;
      total.communication += userScore.score.communication;
      total.time += userScore.score.time;
    }

    //평균 구하기
    total.manner /= memberCount;
    total.mentoring /= memberCount;
    total.passion /= memberCount;
    total.communication /= memberCount;
    total.time /= memberCount;

    //유저의 점수 갱신
    Meteor.users.update(
      {
        _id: user._id,
      },
      {
        $set: {
          "profile.score": total,
        },
      }
    );
  });
}
