import {
  UserScores,
  Studys,
  StudyUsers,
  Notices,
} from "/imports/api/collections";
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

const removeAll = () => {
  Meteor.users.remove({});
  Studys.remove({});
  StudyUsers.remove({});
  UserScores.remove({});
  Notices.remove({});
};

const testUserCount = 30;

//admin이 없다면
if (!Meteor.users.findOne({ username: "admin" })) {
  Accounts.createUser({
    username: "admin",
    password: "1234",
  });
}

//일반 유저가 없다면
if (!Meteor.users.findOne({ username: { $ne: "admin" } })) {
  for (let i = 1; i <= testUserCount; i++) {
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

//스터디 모집글이 없다면
if (!Studys.findOne()) {
  Array.range(0, testUserCount * 0.2).forEach((i) => {
    const user = Meteor.users
      .find({ username: { $ne: "admin" } })
      .fetch()
      .random();

    //글 3개 이상 작성한 사용자는 더 이상 글을 작성할 수 없음
    if (
      Studys.find({
        userId: user._id,
        status: { $in: ["모집중", "시작"] },
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
      role: ["백엔드/프론트엔드", "백엔드", "프론트엔드"].random(),
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
      content: "내용" + i,
      status: "모집중",
      views: i,
      createdAt: new Date(),
      startDate: null,
      endDate: null,
    });
  });
}

//스터디 신청자가 없다면
if (!StudyUsers.findOne()) {
  Studys.find().forEach((study) => {
    //작성자는 승인된 상태로 제일 먼저 추가
    StudyUsers.insert({
      studyId: study._id,
      userId: study.userId,
      status: "승인",
    });
  });

  //유저와 스터디를 각각 랜덤으로 뽑아 신청하는 상황 설정
  const users = Meteor.users.find({ username: { $ne: "admin" } }).fetch();
  const studies = Studys.find().fetch();
  Array.range(0, testUserCount * 3).forEach((i) => {
    const user = users.random();
    const study = studies.random();

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

    StudyUsers.insert({
      studyId: study._id,
      userId: user._id,
      status: "대기",
    });
  });
}

//팀장이 신청자 목록을 봤을 때
if (!StudyUsers.findOne({ status: "거절" })) {
  //신청한 사용자를 팀장이 대기, 승인, 거절하는 상황 설정
  Studys.find().forEach((study) => {
    StudyUsers.find({ studyId: study._id, status: "대기" }).forEach(
      (studyUsers) => {
        const status = ["대기", "승인", "거절"].random();

        //모집인원 넘게 승인된 유저 수가 생기지 않도록 설정
        if (
          StudyUsers.find({ studyId: study._id, status: "승인" }).count() >=
          study.memberCount
        ) {
          return;
        }

        StudyUsers.update(
          { _id: studyUsers._id },
          { $set: { status: status } }
        );

        //팀장이 대기 중인 유저를 승인/거절했을 경우 알림 전송
        if (status === "승인" || status === "거절") {
          Notices.insert({
            studyId: study._id,
            userId: studyUsers.userId,
            message: `신청하신 ${study.title} 프로젝트에 ${status} 되었습니다`,
            read: false,
            createdAt: new Date(),
          });
        }
      }
    );
  });
}

//removeAll();

// //평가 후 유저들의 평균 점수를 계산해서 user.profile.score를 갱신하는 함수
// const calculateaAvgScore = () => {
//   Meteor.users.find({ username: { $ne: "admin" } }).forEach((user) => {
//     const total = {
//       manner: 0,
//       mentoring: 0,
//       passion: 0,
//       communication: 0,
//       time: 0,
//     };

//     //평가한 사람 수
//     const memberCount = UserScores.find({ userId: user._id }).count();
//     //유저가 받은 평가 문서를 모두 확인 후 항목당 총합 구하기
//     UserScores.find({ userId: user._id }).forEach((userScore) => {
//       total.manner += userScore.score.manner;
//       total.mentoring += userScore.score.mentoring;
//       total.passion += userScore.score.passion;
//       total.communication += userScore.score.communication;
//       total.time += userScore.score.time;
//     });

//     //평균 구하기
//     total.manner /= memberCount;
//     total.mentoring /= memberCount;
//     total.passion /= memberCount;
//     total.communication /= memberCount;
//     total.time /= memberCount;

//     //유저 점수 갱신
//     Meteor.users.update(
//       { _id: user._id },
//       {
//         $set: {
//           "profile.score": total,
//         },
//       }
//     );
//   });
// };
// if (!UserScores.findOne()) {
//   calculateaAvgScore();
// }

// //모집완료가 없다면
// if (!Studys.findOne({ status: "모집완료" })) {
//   Studys.find({ status: "모집중" }).forEach((study) => {
//     const status = ["모집중", "모집완료"].random();

//     Studys.update({ _id: study._id }, { $set: { status: status } });

//     //팀장이 모집완료 했을 경우 대기, 거절인 사용자에게 알림 전송
//     if (status === "모집완료") {
//       StudyUsers.find({
//         studyId: study._id,
//         status: { $in: ["대기", "거절"] },
//       }).forEach((studyUser) => {
//         Notices.insert({
//           studyId: study._id,
//           userId: studyUser.userId,
//           message: `${study.title}에 선택되지 않으셨습니다. 다른 모임을 찾아 보세요`,
//           readAt: null,
//         });
//         StudyUsers.remove({ _id: studyUser._id });
//       });
//     }
//   });
// }

// //프로젝트 종료가 없다면
// if (!Studys.findOne({ status: "프로젝트종료" })) {
//   Studys.find({ status: "모집완료" }).forEach((study) => {
//     const status = ["모집완료", "프로젝트종료"].random();

//     if (status === "프로젝트종료") {
//       Studys.update({ _id: study._id }, { $set: { status: status } });
//     }
//   });
// }

//프로젝트 종료 후 평가 기록이 없다면
// if (!Evaluates.findOne()) {
//   //프로젝트가 종료됐을 때 참여한 인원의 아이디 가져오기
//   Studys.find({ status: "프로젝트종료" }).forEach((study) => {
//     const toIds = StudyUsers.find({ studyId: study._id }).forEach(
//       (studyUser) => {
//         return studyUser.userId;
//       }
//     );

//     StudyUsers.find({ studyId: study._id }).forEach((studyUsers) => {
//       ddd;
//     });
//   });
// }
