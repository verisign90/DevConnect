import { Meteor } from "meteor/meteor";
import {
  Studys,
  UserScores,
  StudyUsers,
  Notices,
} from "/imports/api/collections";
import "/imports/lib/utils.js";

Meteor.methods({
  //모집중 -> 시작으로 status 변경하고 대기, 거절된 사용자에게 알림 전송
  statusStart: (studyId) => {
    const teamCount = StudyUsers.find({
      studyId: studyId,
      status: "승인",
    }).count();
    console.log(teamCount);

    if (teamCount === 1) {
      throw new Meteor.Error(
        "onlyOne",
        "팀원을 모으지 않으면 프로젝트를 시작할 수 없습니다"
      );
    }

    //모집중 -> 시작으로 status 변경
    const result = Studys.update(
      { _id: studyId },
      { $set: { status: "시작", startDate: new Date() } }
    );

    if (result) {
      //프로젝트가 시작되면 대기, 거절된 사용자에게 알림 전송
      StudyUsers.find({
        studyId: studyId,
        status: { $in: ["대기", "거절"] },
      }).forEach((studyUser) => {
        const study = Studys.findOne({ _id: studyId });

        Notices.insert({
          studyId: studyId,
          userId: studyUser.userId,
          message: `${study.title}에 선택되지 않으셨습니다. 다른 모임을 찾아 보세요`,
          read: false,
          createdAt: new Date(),
        });

        StudyUsers.remove({ _id: studyUser._id });
      });

      //1. 현재 모집글의 승인된 유저 목록 가져오기
      const okUsers = StudyUsers.find({
        studyId: studyId,
        status: "승인",
      }).fetch();

      okUsers.forEach((studyUser) => {
        //승인된 유저 목록의 userId 추출
        const userId = studyUser.userId;
        const username = Meteor.users.findOne({
          _id: studyUser.userId,
        }).username;

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

        //승인되어 시작한 모집글이 3개 이상이면 승인됐지만 아직 모집중인 모집글에서 사용자 신청 이력 제거
        if (startCount >= 3) {
          //3. 사용자가 승인되어 참여 중인 모집글 중에서 모집중 상태인 것만 가져오기
          const recruitStudy = Studys.find({
            _id: {
              //사용자가 승인되어 참여 중인 프로젝트의 모든 studyId 추출
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
  },

  //시작 -> 종료로 status 변경되면 UserScores에 상호평가지 insert 후 알림 전송
  statusEnd: (studyId) => {
    try {
      //시작 -> 종료로 status 변경
      Studys.update(
        { _id: studyId },
        { $set: { status: "종료", endDate: new Date() } }
      );

      //종료된 프로젝트의 팀원 목록 가져오기
      const teamMembers = StudyUsers.find({ studyId: studyId });
      //팀원들의 id 목록 추출
      const toIds = teamMembers.map((studyUser) => studyUser.userId);

      //상호평가지 데이터 insert
      teamMembers.forEach((studyUser) => {
        const fromId = studyUser.userId; //fromId 평가하는 사람

        //toId 평가 받는 사람
        toIds.forEach((toId) => {
          //내가 아닌 사용자만 평가
          if (toId !== fromId) {
            //혹시 중복이 있다면 return
            if (
              UserScores.findOne({
                studyId: studyId,
                from: fromId,
                to: toId,
              })
            ) {
              return;
            }

            //중복이 없다면 상호평가지 insert
            UserScores.insert({
              studyId: studyId,
              from: fromId,
              to: toId,
              score: {},
              isDone: false,
            });
          }
        });
      });

      //종료된 프로젝트에 참여한 인원에게 알림 전송
      teamMembers.forEach((studyUser) => {
        const study = Studys.findOne({ _id: studyId });

        Notices.insert({
          studyId: studyId,
          userId: studyUser.userId,
          message: `${study.title} 프로젝트가 종료되었습니다. 팀원을 평가해 주세요`,
          read: false,
          createdAt: new Date(),
        });
      });
    } catch (error) {
      console.error("statusEnd 서버 실패: ", error);
    }
  },
});
