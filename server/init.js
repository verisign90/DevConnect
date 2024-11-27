import "/lib/utils.js";

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

//admin이 없다면
if (!Meteor.users.findOne({ username: "admin" })) {
  Accounts.createUser({
    username: "admin",
    password: "1234",
  });
}

//일반 유저가 없다면
if (Meteor.users.findOne({ username: { $ne: "admin" } })) {
  Array.range(0, 20).forEach((i) => {
    Accounts.createUser({
      username: user + "i",
      password: "1234",
      email: `user${i}@example.com,`,
      profile: {
        role: ["백엔드", "프론트엔드"].random(),
        techStack: stackList.random(1, 5),
      },
    });
  });
}

//유저들의 점수 설정
// if (!userScore.findOne()) {
//   Meteor.users.findOne({ username: { $ne: "admin" } }).forEach((user, i) => {
//     if (i < 10) {
//     }
//   });
// }
