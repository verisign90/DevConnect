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
  const imagePaths = [
    "/images/img1.png",
    "/images/img2.png",
    "/images/img3.png",
    "/images/img4.png",
    "/images/img5.png",
    null,
  ];

  for (let i = 1; i <= testUserCount; i++) {
    Accounts.createUser({
      username: "user" + i,
      password: "1234",
      email: `user${i}@example.com`,
      profile: {
        role: ["백엔드", "프론트엔드"].random(),
        techStack: stackList.random(1, 5),
        image: imagePaths.random(),
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
  Array.range(0, testUserCount * 0.3).forEach((i) => {
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

    //모집글 더미데이터
    const titleContent = [
      {
        title: "글로벌 여행 경험 공유 앱 'TravelTales' 개발자 모집",
        content:
          "전 세계 여행자들의 경험을 공유하는 TravelTales 개발에 함께할 개발자를 찾습니다!",
      },
      {
        title: "엔터프라이즈급 프로젝트 관리 플랫폼 'ProjectPro' 개발자 모집",
        content:
          "대규모 프로젝트 관리를 효율적으로 지원하는 ProjectPro 개발에 참여하세요!",
      },
      {
        title: "AI 기반 개인화 학습 플랫폼 'EduMind' 개발자 모집",
        content:
          "사용자의 학습 패턴을 분석하여 맞춤형 교육을 제공하는 EduMind를 개발할 개발자를 찾습니다.",
      },
      {
        title: "크로스 플랫폼 소셜 피트니스 앱 'FitConnect' 개발자 모집",
        content:
          "운동을 더 즐겁게! FitConnect에서 크로스 플랫폼 소셜 피트니스 서비스를 함께 개발할 개발자를 모집합니다.",
      },
      {
        title: "스마트 헬스케어 통합 플랫폼 'HealthSync' 개발자 모집",
        content:
          "건강 데이터를 하나로 통합하는 HealthSync 개발 프로젝트에 함께할 개발자를 찾습니다.",
      },
      {
        title: "AI 기반 지속 가능한 농업 플랫폼 'GreenGrow' 개발자 모집",
        content: "농업의 미래를 AI로 혁신하는 GreenGrow 개발에 참여하세요!",
      },
      {
        title:
          "멀티 플랫폼 지속 가능한 농업 관리 시스템 'GreenHarvest' 개발자 모집",
        content:
          "지속 가능한 농업을 위한 GreenHarvest 시스템을 함께 개발할 개발자를 찾습니다.",
      },
      {
        title: "글로벌 여행 동행 앱 'WanderMate' 개발자 모집",
        content:
          "여행자들의 동행을 연결하는 WanderMate 개발에 함께할 개발자를 모집합니다.",
      },
      {
        title:
          "클라우드 네이티브 마이크로서비스 플랫폼 'CloudNative Hub' 개발자 모집",
        content:
          "클라우드 환경에서 확장 가능한 마이크로서비스 플랫폼, CloudNative Hub를 개발할 인재를 찾습니다.",
      },
      {
        title: "AI 기반 컨테이너화 데이터 분석 플랫폼 'DataDock' 개발자 모집",
        content:
          "데이터 분석의 새로운 패러다임, DataDock을 함께 개발할 개발자를 모집합니다.",
      },
    ];
    const studyPost = titleContent.random();

    Studys.insert({
      userId: user._id,
      title: studyPost.title,
      role: ["백엔드/프론트엔드", "백엔드", "프론트엔드"].random(),
      onOff: ["온라인", "오프라인", "온/오프라인"].random(),
      location: {
        city: randomCity.city,
        gubun: randomGubun,
      },
      memberCount: 6,
      techStack: stackList.random(1, 5),
      score: {
        manner: [0, 1, 2, 2, 2, 3, 3, 3, 3].random(),
        communication: [0, 1, 2, 2, 2, 3, 3, 3, 3].random(),
        passion: [0, 1, 2, 2, 2, 3, 3, 3, 3].random(),
        mentoring: [0, 1, 2, 2, 2, 3, 3, 3, 3].random(),
        time: [0, 1, 2, 2, 2, 3, 3, 3, 3].random(),
      },
      content: studyPost.content,
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
    const comments = [
      "프로젝트 기간은 얼마나 되나요? 장기 프로젝트인가요?",
      "이런 기회가 많아졌으면 좋겠어요. 좋은 프로젝트입니다!",
      "이전에 비슷한 프로젝트 경험이 있으신 분들도 계신가요?",
      "팀원들과의 협업이 기대됩니다. 함께 일해보고 싶어요!",
      "이 프로젝트에 대한 더 많은 정보가 필요해요",
      "참여할 수 있는 기회를 주셔서 감사합니다!",
      "이런 프로젝트는 정말 흥미롭네요. 지원할게요!",
      "원격으로 참여 가능한지 궁금합니다",
      "프로젝트가 처음인 사람도 지원 가능한가요? 열정만큼은 자신 있습니다!",
      "모두가 함께 성장할 수 있는 기회가 되길 바랍니다!",
    ];

    Comments.insert({
      studyId: study._id,
      userId: user._id,
      username: user.username,
      image: user.profile.image,
      comment: comments.random(),
      createdAt: new Date(),
    });
  });
}
//console.log("댓글 생성 완료");

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
  Array.range(0, testUserCount * 5).forEach((i) => {
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

    const status = ["모집중", "시작", "시작"].random();

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

      //1. 현재 모집글의 승인된 유저 목록 가져오기
      const okUsers = StudyUsers.find({
        studyId: study._id,
        status: "승인",
      }).fetch();

      okUsers.forEach((studyUser) => {
        //승인된 유저 목록의 userId 추출
        const userId = studyUser.userId;
        const username = Meteor.users.findOne({ _id: userId }).username;

        //2. 사용자가 승인되어 참여 중인 모집글 중에 시작 상태인 모집글 개수 가져오기
        const startCount = Studys.find({
          _id: {
            //사용자가 승인되어 참여 중인 프로젝트의 모든 studyId 추출
            $in: StudyUsers.find({ userId: userId, status: "승인" }).map(
              (doc) => doc.studyId
            ),
          },
          status: "시작",
        }).count();

        //승인되어 시작한 모집글이 3개 이상이면, 승인됐지만 아직 모집중인 모집글에서 사용자 신청 이력 제거
        if (startCount >= 3) {
          //3. 사용자가 승인되어 참여 중인 모집글 중에서 모집중 상태인 것만 가져오기
          const recruitStudy = Studys.find({
            _id: {
              $in: StudyUsers.find({ userId: userId, status: "승인" }).map(
                (doc) => doc.studyId
              ),
            },
            status: "모집중",
          }).fetch();

          //4. 스터디 신청 이력 제거
          recruitStudy.forEach((study) => {
            //모집중인 studyId, 모집중인 프로젝트에 승인된 userId
            StudyUsers.remove({ studyId: study._id, userId: userId });

            //모집중 상태인 모집글의 팀장에게 알림 전송
            Notices.insert({
              studyId: study._id,
              userId: study.userId,
              message: `${username}님이 ${study.title}에 참여할 수 없어서 승인 목록에서 삭제되었습니다`,
              read: false,
              createdAt: new Date(),
            });
          });
        }
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
