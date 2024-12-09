import {
  UserScores,
  Studys,
  StudyUsers,
  Notices,
  Comments,
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

//removeAll();

const testUserCount = 100;

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
      email: `user${i}@example.com`,
      profile: {
        role: ["백엔드", "프론트엔드"].random(),
        techStack: stackList.random(1, 5),
        image: null,
        score: {
          manner: 3,
          mentoring: 3,
          passion: 3,
          communication: 3,
          time: 3,
        },
      },
    });
  }
}
//console.log("유저 data 완성");

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
        manner: [0, 1, 2, 2, 3, 3, 4].random(),
        mentoring: [0, 1, 2, 2, 3, 3, 4].random(),
        passion: [0, 1, 2, 2, 3, 3, 4].random(),
        communication: [0, 1, 2, 2, 3, 3, 4].random(),
        time: [0, 1, 2, 2, 3, 3, 4].random(),
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
//console.log("모집글 생성 완료");

//댓글이 없다면
if (!Comments.findOne()) {
  const users = Meteor.users.find({ username: { $ne: "admin" } }).fetch();
  const studys = Studys.find().fetch();

  Array.range(0, testUserCount * 0.5).forEach((i) => {
    const user = users.random();
    const study = studys.random();

    Comments.insert({
      studyId: study._id,
      userId: user._id,
      username: user.username,
      image: null,
      comment: "댓글" + i,
      createdAt: new Date(),
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

    //어디에 내가 참여 신청을 했는지 알림 전송
    Notices.insert({
      studyId: study._id,
      userId: user._id,
      message: `${study.title}에 참여 신청이 완료되었습니다`,
      read: false,
      createdAt: new Date(),
    });

    //작성자에게 참여 버튼을 누른 신청자가 있다는 알림 전송
    Notices.insert({
      studyId: study._id,
      userId: study.userId,
      message: `${study.title}에 새로운 신청자가 있습니다`,
      read: false,
      createdAt: new Date(),
    });
  });
}
//console.log("신청자 목록 완성");

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
        if (status === "승인") {
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
//console.log("유저가 승인/거절/대기되는 상황 완료");

//프로젝트 시작이 없다면
if (!Studys.findOne({ status: "시작" })) {
  Studys.find({ status: "모집중" }).forEach((study) => {
    //팀원이 작성자 혼자일 경우 프로젝트 시작을 할 수 없음
    if (StudyUsers.find({ studyId: study._id, status: "승인" }).count() === 1)
      return;

    const status = ["모집중", "시작"].random();

    //프로젝트가 시작되면 대기, 거절된 사용자에게 알림 전송
    if (status === "시작") {
      Studys.update(
        { _id: study._id },
        { $set: { status: status, startDate: new Date() } }
      );

      StudyUsers.find({
        studyId: study._id,
        status: { $in: ["대기", "거절"] },
      }).forEach((studyUser) => {
        Notices.insert({
          studyId: study._id,
          userId: studyUser.userId,
          message: `${study.title}에 선택되지 않으셨습니다. 다른 모임을 찾아 보세요`,
          read: false,
          createdAt: new Date(),
        });
        StudyUsers.remove({ _id: studyUser._id });
      });
    }
  });
}
//console.log("프로젝트가 시작하면 대기 중인 사용자 정리");

//프로젝트 종료가 없다면
if (!Studys.findOne({ status: "종료" })) {
  Studys.find({ status: "시작" }).forEach((study) => {
    const status = ["시작", "종료"].random();

    //종료날짜를 시작날짜로부터 1~6개월 후로 설정
    let endDate = new Date(study.startDate);
    const randomMonths = [1, 2, 3, 4, 5, 6].random();
    endDate.setMonth(study.startDate.getMonth() + randomMonths);

    if (status === "종료") {
      Studys.update(
        { _id: study._id },
        { $set: { status: status, endDate: endDate } }
      );

      //프로젝트에 참여했던 모든 유저에게 알림 전송
      const teamMembers = StudyUsers.find({ studyId: study._id }).fetch();
      teamMembers.forEach((studyUser) => {
        Notices.insert({
          studyId: study._id,
          userId: teamMembers.userId,
          message: `${study.title} 프로젝트가 종료되었습니다. 팀원을 평가해 주세요`,
          read: false,
          createdAt: new Date(),
        });
      });
    }
  });
}
//console.log("프로젝트 종료 후 알림 전송");

//프로젝트 종료 후 상호 평가
//종료된 프로젝트의 팀원들 id 모두 추출하기(to : 평가 받는 사람)
Studys.find({ status: "종료" }).forEach((study) => {
  const toIds = StudyUsers.find({ studyId: study._id }).map((user) => {
    return user.userId;
  });

  //종료된 프로젝트의 팀원 목록을 모두 가져와서 from(평가 하는 사람)으로 설정
  StudyUsers.find({ studyId: study._id }).forEach((studyUser) => {
    toIds.forEach((toId) => {
      const fromId = studyUser.userId;

      //내가 아닌 유저만 평가
      if (fromId !== toId) {
        //혹시 UserScores에 내가 A를 이미 평가한 기록이 있다면 return
        if (
          UserScores.findOne({
            studyId: study._id,
            from: fromId,
            to: toId,
          })
        ) {
          return;
        }
        UserScores.insert({
          studyId: study._id,
          from: fromId,
          to: toId,
          score: {},
          isDone: false,
        });
      }
    });
  });
});
//console.log("from, to, isDone:false 평가 준비");

//평가 받는 사람의 평균 점수를 계산해서 user.profile.score로 갱신
const runAvgScore = (toId) => {
  const total = {
    manner: 0,
    mentoring: 0,
    passion: 0,
    communication: 0,
    time: 0,
  };

  //나를 평가한 사람 수
  const count = UserScores.find({ to: toId, isDone: true }).count();
  //내가 받은 점수 총점
  UserScores.find({ to: toId, isDone: true }).forEach((userScore) => {
    total.manner += userScore.score.manner;
    total.mentoring += userScore.score.mentoring;
    total.passion += userScore.score.passion;
    total.communication += userScore.score.communication;
    total.time += userScore.score.time;
  });
  //평균 점수 계산
  total.manner /= count;
  total.mentoring /= count;
  total.passion /= count;
  total.communication /= count;
  total.time /= count;

  //평균 점수를 user.profiles.score로 갱신
  Meteor.users.update({ _id: toId }, { $set: { "profile.score": total } });
};
//console.log("평가 점수 갱신");

//평가를 아무도 안 했다면
if (UserScores.find({ isDone: false })) {
  UserScores.find({ isDone: false }).forEach((userScore) => {
    //평가 안 된 평가지의 평가 점수 설정
    const to = userScore.to; //to: 평가 받는 사람
    UserScores.update(
      { _id: userScore._id },
      {
        $set: {
          isDone: true,
          score: {
            manner: [1, 2, 3, 4, 5].random(),
            mentoring: [1, 2, 3, 4, 5].random(),
            passion: [1, 2, 3, 4, 5].random(),
            communication: [1, 2, 3, 4, 5].random(),
            time: [1, 2, 3, 4, 5].random(),
          },
        },
      }
    );

    //평가 받는 사람의 평균 점수를 계산해서 user.profile.score로 갱신
    runAvgScore(to);
  });
}
//console.log("평가 점수 설정");
