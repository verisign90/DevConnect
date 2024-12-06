import { Meteor } from "meteor/meteor";
import { Studys, UserScores, StudyUsers } from "/imports/api/collections";
import "/imports/lib/utils.js";

Meteor.methods({
  //모집중 -> 시작으로 status 변경
  statusStart: (studyId) => {
    return Studys.update(
      { _id: studyId },
      { $set: { status: "시작", startDate: new Date() } }
    );
  },

  //시작 -> 종료로 status 변경 후 UserScores에 상호평가지 insert
  statusEnd: (studyId) => {
    //시작 -> 종료로 status 변경
    const result = Studys.update(
      { _id: studyId },
      { $set: { status: "종료", endDate: new Date() } }
    );

    if (result) {
      //종료된 프로젝트의 팀원 id 목록 추출하기
      const toIds = StudyUsers.find({ studyId: studyId }).map((studyUsers) => {
        return studyUsers.userId;
      });

      //이중 for문으로 상호평가 준비. 바깥 for문-from(평가하는 사람), 안쪽 for문-to(평가 받는 사람)
      StudyUsers.find({ studyId: studyId }).forEach((studyUser) => {
        toIds.forEach((toId) => {
          const fromId = studyUser.userId;

          //내가 아닌 사용자만 평가
          if (toId !== fromId) {
            //혹시 중복이 있다면 리턴
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
            const doneRlt = UserScores.insert({
              studyId: studyId,
              from: fromId,
              to: toId,
              score: {},
              isDone: false,
            });
            console.log(doneRlt);
          }
        });
      });
    }
    return result;
  },
});
