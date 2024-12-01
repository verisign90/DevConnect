import { UserScores, Studys, StudyUsers } from "/imports/api/collections";
import "/imports/lib/utils.js";
import locationData from "./location.js";

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
// UserScores.remove({});

//admin이 없다면
if (!Meteor.users.findOne({ username: "admin" })) {
  Accounts.createUser({
    username: "admin",
    password: "1234",
  });
}

//일반 유저가 없다면
if (!Meteor.users.findOne({ username: { $ne: "admin" } })) {
  for (let i = 1; i <= 20; i++) {
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
  }
}

//유저들의 점수 설정
if (!UserScores.findOne()) {
  Meteor.users.find({ username: { $ne: "admin" } }).forEach((user, i) => {
    //최초 가입자는 3점으로 설정
    if (i < 10) {
      UserScores.insert({
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
      //프로젝트를 최소 한 번 이상 한 사용자 점수 설정
      UserScores.insert({
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

//평가 후 유저들의 평균 점수를 계산해서 유저 점수 갱신하는 함수
const calculateaAvgScore = () => {
  Meteor.users.find({ username: { $ne: "admin" } }).forEach((user) => {
    const total = {
      manner: 0,
      mentoring: 0,
      passion: 0,
      communication: 0,
      time: 0,
    };

    //평가한 사람 수
    const memberCount = UserScores.find({ userId: user._id }).count();
    //유저가 받은 평가 문서를 모두 확인 후 항목당 총합 구하기
    UserScores.find({ userId: user._id }).forEach((userScore) => {
      total.manner += userScore.score.manner;
      total.mentoring += userScore.score.mentoring;
      total.passion += userScore.score.passion;
      total.communication += userScore.score.communication;
      total.time += userScore.score.time;
    });

    //평균 구하기
    total.manner /= memberCount;
    total.mentoring /= memberCount;
    total.passion /= memberCount;
    total.communication /= memberCount;
    total.time /= memberCount;

    //유저의 점수 갱신
    Meteor.users.update(
      { _id: user._id },
      {
        $set: {
          "profile.score": total,
        },
      }
    );
  });
};
if (!UserScores.findOne()) {
  calculateaAvgScore();
}

//스터디 모집글이 없다면
if (!Studys.findOne()) {
  Array.range(0, 5).forEach((i) => {
    const user = Meteor.users.find().fetch().random();

    //글 3개 이상 작성한 사용자는 더 이상 글을 작성할 수 없음
    if (
      Studys.find({
        userId: user._id,
        status: { $in: ["모집중", "모집완료"] },
      }).count() >= 3
    ) {
      return;
    }

    //시/도, 구/군 설정
    const randomCity = locationData.random();
    const randomGubun = randomCity.gubun.random();

    Studys.insert({
      userId: user._id,
      title: "제목" + i,
      role: ["전체", "백엔드", "프론트엔드"].random(),
      onOff: ["온라인", "오프라인", "온/오프라인"].random(),
      location: {
        city: randomCity.city,
        gubun: randomGubun,
      },
      memberCount: [2, 3, 4, 5, 6].random(),
      techStack: stackList.random(1, 5),
      score: {
        manner: [0, 1, 2, 3].random(),
        mentoring: [0, 1, 2, 3].random(),
        passion: [0, 1, 2, 3].random(),
        communication: [0, 1, 2, 3].random(),
        time: [0, 1, 2, 3].random(),
      },
      status: "모집중",
      views: i,
      createdAt: new Date(),
    });
  });
}

//스터디 신청자가 없다면
if (!StudyUsers.findOne()) {
  Studys.find().forEach((study) => {
    //글 작성자는 승인된 상태로 제일 먼저 추가
    StudyUsers.insert({
      studyId: study._id,
      userId: study.userId,
      status: "승인",
    });
  });

  //유저와 스터디를 각각 랜덤으로 뽑아 신청하는 상황 설정
  const users = Meteor.users.find({ username: { $ne: "admin" } }).fetch();
  const studies = Studys.find().fetch();
  Array.range(0, 50).forEach((i) => {
    const user = users.random();
    const study = studies.random();

    //스터디 모집글이 모집완료이면 신청 불가
    if (study.status === "모집완료") return;
    //유저의 점수 < 작성자 요구 점수이면 신청 불가. 유저의 점수 >= 작성자 요구 점수 신청 가능
    if (user.profile.score.manner < study.score.manner) {
      return;
    }
    if (user.profile.score.mentoring < study.score.manner) {
      return;
    }
    if (user.profile.score.passion < study.score.manner) {
      return;
    }
    if (user.profile.score.communication < study.score.manner) {
      return;
    }
    if (user.profile.score.time < study.score.manner) {
      return;
    }
    //같은 모집글에 이미 신청한 사용자는 두 번 신청할 수 없음
    if (StudyUsers.findOne({ studyId: study._id, userId: user._id })) return;
  });
}
